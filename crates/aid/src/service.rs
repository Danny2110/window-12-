use platform_contracts::{
    AiIntent, AiIntentRequest, AiIntentResponse, AiService, CONTRACT_VERSION, HealthRequest,
    HealthResponse, HealthService, ServiceStatus,
};

pub const SERVICE_NAME: &str = "aid";

pub struct AiDaemon;

impl HealthService for AiDaemon {
    fn health(&self, req: HealthRequest) -> HealthResponse {
        HealthResponse {
            service: req.service,
            status: ServiceStatus::Healthy,
            contract_version: CONTRACT_VERSION,
        }
    }
}

impl AiService for AiDaemon {
    fn parse_intent(&self, req: AiIntentRequest) -> AiIntentResponse {
        let text = req.text.to_lowercase();
        let intent = if text.contains("find") || text.contains("search") {
            AiIntent::SearchFiles
        } else if text.contains("open") || text.contains("launch") {
            AiIntent::OpenApp
        } else if text.contains("setting") || text.contains("brightness") {
            AiIntent::ChangeSetting
        } else if text.contains("optimize") || text.contains("cleanup") {
            AiIntent::OptimizeSystem
        } else {
            AiIntent::Unknown
        };

        let privileged = matches!(intent, AiIntent::ChangeSetting | AiIntent::OptimizeSystem);
        let requires_confirmation = privileged && !req.allow_privileged;

        AiIntentResponse {
            intent,
            requires_confirmation,
            plan: "Stub policy: route intent to capability executor".to_string(),
        }
    }
}
