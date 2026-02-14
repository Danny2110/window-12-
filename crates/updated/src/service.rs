use platform_contracts::{
    CONTRACT_VERSION, HealthRequest, HealthResponse, HealthService, ServiceStatus, UpdateAction,
    UpdateActionRequest, UpdateActionResponse, UpdateChannel, UpdateCheckRequest, UpdateCheckResponse,
    UpdateService,
};

pub const SERVICE_NAME: &str = "updated";

pub struct UpdateDaemon;

impl HealthService for UpdateDaemon {
    fn health(&self, req: HealthRequest) -> HealthResponse {
        HealthResponse {
            service: req.service,
            status: ServiceStatus::Healthy,
            contract_version: CONTRACT_VERSION,
        }
    }
}

impl UpdateService for UpdateDaemon {
    fn check_updates(&self, req: UpdateCheckRequest) -> UpdateCheckResponse {
        let version = match req.channel {
            UpdateChannel::Stable => Some("0.1.1".to_string()),
            UpdateChannel::Insider => Some("0.2.0-insider.1".to_string()),
            UpdateChannel::Lts => Some("0.1.0-lts".to_string()),
        };

        UpdateCheckResponse {
            available: true,
            version,
        }
    }

    fn run_action(&self, req: UpdateActionRequest) -> UpdateActionResponse {
        let message = match req.action {
            UpdateAction::Stage => format!("Staging {:?}", req.target_version),
            UpdateAction::Apply => format!("Applying {:?}", req.target_version),
            UpdateAction::Rollback => "Rolling back to previous known good image".to_string(),
        };

        UpdateActionResponse {
            accepted: true,
            message,
        }
    }
}
