mod service;

use platform_contracts::{CompatLaunchPlanRequest, CompatService, HealthRequest, HealthService};
use service::{CompatDaemon, SERVICE_NAME};

fn main() {
    let daemon = CompatDaemon;
    let args: Vec<String> = std::env::args().collect();

    if args.iter().any(|a| a == "--health") {
        let health = daemon.health(HealthRequest { service: SERVICE_NAME });
        println!("{}:{}:{}", health.service, health.status, health.contract_version);
        return;
    }

    if args.len() > 1 {
        let plan = daemon.build_launch_plan(CompatLaunchPlanRequest {
            exe_path: args[1].clone(),
            arguments: args[2..].to_vec(),
        });
        println!("launch_profile={:?}", plan.api_profile);
        for warning in plan.warnings {
            println!("warning={warning}");
        }
        return;
    }

    println!("{SERVICE_NAME} started (stub). Usage: compatd --health | compatd <path.exe> [args]");
}
