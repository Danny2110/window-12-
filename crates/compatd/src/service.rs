use platform_contracts::{
    CompatApiProfile, CompatLaunchPlanRequest, CompatLaunchPlanResponse, CompatService,
    CONTRACT_VERSION, HealthRequest, HealthResponse, HealthService, ServiceStatus,
};

pub const SERVICE_NAME: &str = "compatd";

pub struct CompatDaemon;

impl HealthService for CompatDaemon {
    fn health(&self, req: HealthRequest) -> HealthResponse {
        HealthResponse {
            service: req.service,
            status: ServiceStatus::Healthy,
            contract_version: CONTRACT_VERSION,
        }
    }
}

impl CompatService for CompatDaemon {
    fn build_launch_plan(&self, req: CompatLaunchPlanRequest) -> CompatLaunchPlanResponse {
        let profile = if req.exe_path.ends_with(".exe") {
            CompatApiProfile::TierAWin32
        } else {
            CompatApiProfile::Unknown
        };

        CompatLaunchPlanResponse {
            api_profile: profile,
            warnings: vec![
                "Stub launch planner: API coverage and DLL mapping not yet implemented".to_string(),
            ],
        }
    }
}
