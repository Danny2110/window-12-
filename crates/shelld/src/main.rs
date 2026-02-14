use platform_contracts::{
    HealthRequest, HealthResponse, HealthService, CONTRACT_VERSION, ServiceStatus, ShellSearchRequest,
    ShellSearchResponse, ShellService,
};

const SERVICE: &str = "shelld";

struct ShellDaemon;

impl HealthService for ShellDaemon {
    fn health(&self, req: HealthRequest) -> HealthResponse {
        HealthResponse {
            service: req.service,
            status: ServiceStatus::Healthy,
            contract_version: CONTRACT_VERSION,
        }
    }
}

impl ShellService for ShellDaemon {
    fn search(&self, req: ShellSearchRequest) -> ShellSearchResponse {
        let q = req.query.to_lowercase();
        let mut app_hits = Vec::new();
        let mut file_hits = Vec::new();
        let mut setting_hits = Vec::new();

        if q.contains("term") {
            app_hits.push("Windows Terminal".to_string());
        }
        if q.contains("explorer") {
            app_hits.push("File Explorer".to_string());
        }
        if q.contains("settings") {
            app_hits.push("Settings".to_string());
            setting_hits.push("System > Display".to_string());
        }
        if q.contains("roadmap") {
            file_hits.push("C:\\Users\\Demo\\Documents\\Roadmap.docx".to_string());
        }

        ShellSearchResponse {
            app_hits,
            file_hits,
            setting_hits,
        }
    }
}

fn main() {
    let d = ShellDaemon;
    let args: Vec<String> = std::env::args().collect();

    if args.iter().any(|a| a == "--health") {
        let h = d.health(HealthRequest { service: SERVICE });
        println!("{}:{}:{}", h.service, h.status, h.contract_version);
        return;
    }

    if args.len() > 1 {
        let res = d.search(ShellSearchRequest {
            query: args[1..].join(" "),
        });
        println!("apps={:?}", res.app_hits);
        println!("files={:?}", res.file_hits);
        println!("settings={:?}", res.setting_hits);
        return;
    }

    println!("{SERVICE} started (stub). Usage: shelld --health | shelld <query>");
}
