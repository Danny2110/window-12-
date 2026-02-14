mod service;

use platform_contracts::{AiIntentRequest, AiService, HealthRequest, HealthService};
use service::{AiDaemon, SERVICE_NAME};

fn main() {
    let daemon = AiDaemon;
    let args: Vec<String> = std::env::args().collect();

    if args.iter().any(|a| a == "--health") {
        let health = daemon.health(HealthRequest { service: SERVICE_NAME });
        println!("{}:{}:{}", health.service, health.status, health.contract_version);
        return;
    }

    if args.len() > 1 {
        let req = AiIntentRequest {
            text: args[1..].join(" "),
            allow_privileged: false,
        };
        let resp = daemon.parse_intent(req);
        println!(
            "intent={:?} requires_confirmation={} plan={}",
            resp.intent, resp.requires_confirmation, resp.plan
        );
        return;
    }

    println!("{SERVICE_NAME} started (stub). Usage: aid --health | aid <text command>");
}
