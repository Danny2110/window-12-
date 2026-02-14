mod service;

use platform_contracts::{
    HealthRequest, HealthService, UpdateAction, UpdateActionRequest, UpdateChannel, UpdateCheckRequest,
    UpdateService,
};
use service::{UpdateDaemon, SERVICE_NAME};

fn main() {
    let daemon = UpdateDaemon;
    let args: Vec<String> = std::env::args().collect();

    if args.iter().any(|a| a == "--health") {
        let health = daemon.health(HealthRequest { service: SERVICE_NAME });
        println!("{}:{}:{}", health.service, health.status, health.contract_version);
        return;
    }

    if args.iter().any(|a| a == "check") {
        let resp = daemon.check_updates(UpdateCheckRequest {
            channel: UpdateChannel::Stable,
        });
        println!("available={} version={:?}", resp.available, resp.version);
        return;
    }

    if args.iter().any(|a| a == "stage") {
        let resp = daemon.run_action(UpdateActionRequest {
            action: UpdateAction::Stage,
            target_version: Some("0.1.1".to_string()),
        });
        println!("accepted={} message={}", resp.accepted, resp.message);
        return;
    }

    if args.iter().any(|a| a == "apply") {
        let resp = daemon.run_action(UpdateActionRequest {
            action: UpdateAction::Apply,
            target_version: Some("0.1.1".to_string()),
        });
        println!("accepted={} message={}", resp.accepted, resp.message);
        return;
    }

    if args.iter().any(|a| a == "rollback") {
        let resp = daemon.run_action(UpdateActionRequest {
            action: UpdateAction::Rollback,
            target_version: None,
        });
        println!("accepted={} message={}", resp.accepted, resp.message);
        return;
    }

    println!("{SERVICE_NAME} started (stub). Usage: updated --health | updated check|stage|apply|rollback");
}
