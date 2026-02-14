use platform_contracts::{
    BrowserAiAction, BrowserAiRequest, BrowserAiResponse, BrowserPolicyRequest, BrowserPolicyResponse,
    BrowserService, CONTRACT_VERSION, HealthRequest, HealthResponse, HealthService, ServiceStatus,
};
use std::fs;
use std::path::PathBuf;

const SERVICE: &str = "browserd";

struct BrowserDaemon {
    tracker_rules: Vec<String>,
    malware_rules: Vec<String>,
}

impl BrowserDaemon {
    fn rules_dir() -> PathBuf {
        if let Ok(p) = std::env::var("ASTER_BROWSER_RULES_DIR") {
            return PathBuf::from(p);
        }
        PathBuf::from("os/browser/rules")
    }

    fn load_rule_file(path: PathBuf) -> Vec<String> {
        if let Ok(raw) = fs::read_to_string(path) {
            return raw
                .lines()
                .map(|l| l.trim().to_lowercase())
                .filter(|l| !l.is_empty() && !l.starts_with('#'))
                .collect();
        }
        Vec::new()
    }

    fn load() -> Self {
        let dir = Self::rules_dir();
        let trackers = Self::load_rule_file(dir.join("trackers.txt"));
        let malware = Self::load_rule_file(dir.join("malware.txt"));
        Self {
            tracker_rules: trackers,
            malware_rules: malware,
        }
    }

    fn host_from_url(url: &str) -> String {
        let mut s = url.trim().to_lowercase();
        if let Some(idx) = s.find("://") {
            s = s[(idx + 3)..].to_string();
        }
        let host_port = s.split('/').next().unwrap_or("");
        host_port.split(':').next().unwrap_or("").to_string()
    }

    fn matched_rules(host: &str, rules: &[String]) -> Vec<String> {
        rules
            .iter()
            .filter(|r| host == r.as_str() || host.ends_with(&format!(".{}", r)) || host.contains(r.as_str()))
            .cloned()
            .collect()
    }
}

impl HealthService for BrowserDaemon {
    fn health(&self, req: HealthRequest) -> HealthResponse {
        HealthResponse {
            service: req.service,
            status: ServiceStatus::Healthy,
            contract_version: CONTRACT_VERSION,
        }
    }
}

impl BrowserService for BrowserDaemon {
    fn evaluate_policy(&self, req: BrowserPolicyRequest) -> BrowserPolicyResponse {
        let mut url = req.url.trim().to_string();
        if url.starts_with("http://") {
            url = url.replacen("http://", "https://", 1);
        }

        let host = Self::host_from_url(&url);
        let blocked_trackers = Self::matched_rules(&host, &self.tracker_rules);
        let risk_flags = Self::matched_rules(&host, &self.malware_rules)
            .into_iter()
            .map(|r| format!("malware-rule:{}", r))
            .collect::<Vec<String>>();

        BrowserPolicyResponse {
            allow_navigation: risk_flags.is_empty(),
            https_enforced_url: url,
            blocked_trackers,
            risk_flags,
        }
    }

    fn run_ai(&self, req: BrowserAiRequest) -> BrowserAiResponse {
        let output = match req.action {
            BrowserAiAction::Summarize => {
                format!("Summary [{}]: {}", req.page_title, req.selected_text)
            }
            BrowserAiAction::Rewrite => {
                format!("Rewrite suggestion: {}", req.selected_text)
            }
            BrowserAiAction::CodeAssist => {
                format!("Code assist hint: consider modularizing -> {}", req.selected_text)
            }
        };

        BrowserAiResponse {
            output,
            offline_capable: true,
        }
    }
}

fn main() {
    let d = BrowserDaemon::load();
    let args: Vec<String> = std::env::args().collect();

    if args.iter().any(|a| a == "--health") {
        let h = d.health(HealthRequest { service: SERVICE });
        println!("{}:{}:{}", h.service, h.status, h.contract_version);
        return;
    }

    if args.len() > 2 && args[1] == "policy" {
        let out = d.evaluate_policy(BrowserPolicyRequest {
            url: args[2..].join(" "),
        });
        println!(
            "allow={} https_url={} blocked={:?} risk={:?}",
            out.allow_navigation, out.https_enforced_url, out.blocked_trackers, out.risk_flags
        );
        return;
    }

    if args.len() > 3 && args[1] == "ai" {
        let action = match args[2].as_str() {
            "summarize" => BrowserAiAction::Summarize,
            "rewrite" => BrowserAiAction::Rewrite,
            _ => BrowserAiAction::CodeAssist,
        };
        let out = d.run_ai(BrowserAiRequest {
            page_title: "manual-input".to_string(),
            selected_text: args[3..].join(" "),
            action,
        });
        println!("offline={} output={}", out.offline_capable, out.output);
        return;
    }

    if args.len() > 1 && args[1] == "rules" {
        println!("tracker_rules={} malware_rules={}", d.tracker_rules.len(), d.malware_rules.len());
        return;
    }

    println!(
        "{SERVICE} usage:\n  browserd --health\n  browserd rules\n  browserd policy <url>\n  browserd ai <summarize|rewrite|code> <text>"
    );
}
