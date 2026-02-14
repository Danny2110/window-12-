use platform_contracts::{
    HealthRequest, HealthResponse, HealthService, RegistryRequest, RegistryResponse, RegistryService,
    CONTRACT_VERSION, ServiceStatus,
};
use std::collections::HashMap;
use std::fs;
use std::io;
use std::path::PathBuf;

const SERVICE: &str = "regd";

struct RegistryDaemon {
    data: HashMap<String, String>,
    db_path: PathBuf,
}

impl RegistryDaemon {
    fn default_path() -> PathBuf {
        if let Ok(path) = std::env::var("ASTER_REG_PATH") {
            return PathBuf::from(path);
        }
        let home = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
        PathBuf::from(home).join(".asteros").join("registry.db")
    }

    fn escape(s: &str) -> String {
        s.replace('\\', "\\\\").replace('\t', "\\t").replace('\n', "\\n")
    }

    fn unescape(s: &str) -> String {
        let mut out = String::new();
        let mut chars = s.chars().peekable();
        while let Some(c) = chars.next() {
            if c == '\\' {
                if let Some(next) = chars.next() {
                    match next {
                        't' => out.push('\t'),
                        'n' => out.push('\n'),
                        '\\' => out.push('\\'),
                        other => {
                            out.push('\\');
                            out.push(other);
                        }
                    }
                } else {
                    out.push('\\');
                }
            } else {
                out.push(c);
            }
        }
        out
    }

    fn with_defaults(path: PathBuf) -> Self {
        let mut data = HashMap::new();
        data.insert(
            "HKCU\\Software\\AsterOS\\Theme\\Mode".to_string(),
            "dark".to_string(),
        );
        data.insert(
            "HKLM\\Software\\AsterOS\\Compat\\DX\\Enabled".to_string(),
            "true".to_string(),
        );
        Self { data, db_path: path }
    }

    fn load() -> Self {
        let path = Self::default_path();
        let mut d = Self::with_defaults(path.clone());

        if let Ok(raw) = fs::read_to_string(&path) {
            for line in raw.lines() {
                if line.trim().is_empty() || line.starts_with('#') {
                    continue;
                }
                if let Some((k, v)) = line.split_once('\t') {
                    d.data.insert(Self::unescape(k), Self::unescape(v));
                }
            }
        } else {
            let _ = d.save();
        }

        d
    }

    fn save(&self) -> io::Result<()> {
        if let Some(parent) = self.db_path.parent() {
            fs::create_dir_all(parent)?;
        }
        let mut lines: Vec<String> = self
            .data
            .iter()
            .map(|(k, v)| format!("{}\t{}", Self::escape(k), Self::escape(v)))
            .collect();
        lines.sort();
        fs::write(&self.db_path, lines.join("\n"))
    }

    fn composite_key(hive: &str, key_path: &str, value_name: &str) -> String {
        format!("{}\\{}\\{}", hive, key_path, value_name)
    }

    fn set_value(&mut self, hive: &str, key_path: &str, value_name: &str, value: &str) -> io::Result<()> {
        let composite = Self::composite_key(hive, key_path, value_name);
        self.data.insert(composite, value.to_string());
        self.save()
    }

    fn list(&self, prefix: Option<&str>) -> Vec<(String, String)> {
        let mut out: Vec<(String, String)> = self
            .data
            .iter()
            .filter(|(k, _)| prefix.map(|p| k.starts_with(p)).unwrap_or(true))
            .map(|(k, v)| (k.clone(), v.clone()))
            .collect();
        out.sort_by(|a, b| a.0.cmp(&b.0));
        out
    }
}

impl HealthService for RegistryDaemon {
    fn health(&self, req: HealthRequest) -> HealthResponse {
        HealthResponse {
            service: req.service,
            status: ServiceStatus::Healthy,
            contract_version: CONTRACT_VERSION,
        }
    }
}

impl RegistryService for RegistryDaemon {
    fn get_value(&self, req: RegistryRequest) -> RegistryResponse {
        let composite = RegistryDaemon::composite_key(&req.hive, &req.key_path, &req.value_name);
        let value = self.data.get(&composite).cloned();
        RegistryResponse {
            found: value.is_some(),
            value,
        }
    }
}

fn main() {
    let mut d = RegistryDaemon::load();
    let args: Vec<String> = std::env::args().collect();

    if args.iter().any(|a| a == "--health") {
        let h = d.health(HealthRequest { service: SERVICE });
        println!("{}:{}:{}", h.service, h.status, h.contract_version);
        return;
    }

    if args.len() == 4 {
        let out = d.get_value(RegistryRequest {
            hive: args[1].clone(),
            key_path: args[2].clone(),
            value_name: args[3].clone(),
        });
        println!("found={} value={:?}", out.found, out.value);
        return;
    }

    if args.len() >= 6 && args[1] == "set" {
        let value = args[5..].join(" ");
        match d.set_value(&args[2], &args[3], &args[4], &value) {
            Ok(_) => println!("ok=true"),
            Err(e) => println!("ok=false error={}", e),
        }
        return;
    }

    if args.len() >= 5 && args[1] == "get" {
        let out = d.get_value(RegistryRequest {
            hive: args[2].clone(),
            key_path: args[3].clone(),
            value_name: args[4].clone(),
        });
        println!("found={} value={:?}", out.found, out.value);
        return;
    }

    if args.len() >= 2 && args[1] == "list" {
        let prefix = args.get(2).map(|s| s.as_str());
        for (k, v) in d.list(prefix) {
            println!("{}={}", k, v);
        }
        return;
    }

    println!(
        "{SERVICE} usage:\n  regd --health\n  regd <hive> <key_path> <value_name>\n  regd get <hive> <key_path> <value_name>\n  regd set <hive> <key_path> <value_name> <value>\n  regd list [prefix]"
    );
}
