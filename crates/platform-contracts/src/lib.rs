use std::fmt;

pub const CONTRACT_VERSION: &str = "v1";

#[derive(Debug, Clone)]
pub struct HealthRequest {
    pub service: &'static str,
}

#[derive(Debug, Clone)]
pub struct HealthResponse {
    pub service: &'static str,
    pub status: ServiceStatus,
    pub contract_version: &'static str,
}

#[derive(Debug, Clone)]
pub enum ServiceStatus {
    Healthy,
    Degraded,
    Unavailable,
}

#[derive(Debug, Clone)]
pub struct CompatLaunchPlanRequest {
    pub exe_path: String,
    pub arguments: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct CompatLaunchPlanResponse {
    pub api_profile: CompatApiProfile,
    pub warnings: Vec<String>,
}

#[derive(Debug, Clone)]
pub enum CompatApiProfile {
    TierAWin32,
    TierBDotNet,
    Unknown,
}

#[derive(Debug, Clone)]
pub enum UpdateChannel {
    Stable,
    Insider,
    Lts,
}

#[derive(Debug, Clone)]
pub struct UpdateCheckRequest {
    pub channel: UpdateChannel,
}

#[derive(Debug, Clone)]
pub struct UpdateCheckResponse {
    pub available: bool,
    pub version: Option<String>,
}

#[derive(Debug, Clone)]
pub enum UpdateAction {
    Stage,
    Apply,
    Rollback,
}

#[derive(Debug, Clone)]
pub struct UpdateActionRequest {
    pub action: UpdateAction,
    pub target_version: Option<String>,
}

#[derive(Debug, Clone)]
pub struct UpdateActionResponse {
    pub accepted: bool,
    pub message: String,
}

#[derive(Debug, Clone)]
pub struct AiIntentRequest {
    pub text: String,
    pub allow_privileged: bool,
}

#[derive(Debug, Clone)]
pub struct AiIntentResponse {
    pub intent: AiIntent,
    pub requires_confirmation: bool,
    pub plan: String,
}

#[derive(Debug, Clone)]
pub enum AiIntent {
    SearchFiles,
    OpenApp,
    ChangeSetting,
    OptimizeSystem,
    Unknown,
}

pub trait HealthService {
    fn health(&self, req: HealthRequest) -> HealthResponse;
}

pub trait CompatService: HealthService {
    fn build_launch_plan(&self, req: CompatLaunchPlanRequest) -> CompatLaunchPlanResponse;
}

pub trait UpdateService: HealthService {
    fn check_updates(&self, req: UpdateCheckRequest) -> UpdateCheckResponse;
    fn run_action(&self, req: UpdateActionRequest) -> UpdateActionResponse;
}

pub trait AiService: HealthService {
    fn parse_intent(&self, req: AiIntentRequest) -> AiIntentResponse;
}

#[derive(Debug, Clone)]
pub struct ShellSearchRequest {
    pub query: String,
}

#[derive(Debug, Clone)]
pub struct ShellSearchResponse {
    pub app_hits: Vec<String>,
    pub file_hits: Vec<String>,
    pub setting_hits: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct RegistryRequest {
    pub hive: String,
    pub key_path: String,
    pub value_name: String,
}

#[derive(Debug, Clone)]
pub struct RegistryResponse {
    pub found: bool,
    pub value: Option<String>,
}

#[derive(Debug, Clone)]
pub struct FsCompatRequest {
    pub path: String,
}

#[derive(Debug, Clone)]
pub struct FsCompatResponse {
    pub canonical_path: String,
    pub case_insensitive_view: bool,
}

pub trait ShellService: HealthService {
    fn search(&self, req: ShellSearchRequest) -> ShellSearchResponse;
}

pub trait RegistryService: HealthService {
    fn get_value(&self, req: RegistryRequest) -> RegistryResponse;
}

pub trait FsCompatService: HealthService {
    fn normalize_path(&self, req: FsCompatRequest) -> FsCompatResponse;
}

#[derive(Debug, Clone)]
pub struct BrowserPolicyRequest {
    pub url: String,
}

#[derive(Debug, Clone)]
pub struct BrowserPolicyResponse {
    pub allow_navigation: bool,
    pub https_enforced_url: String,
    pub blocked_trackers: Vec<String>,
    pub risk_flags: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct BrowserAiRequest {
    pub page_title: String,
    pub selected_text: String,
    pub action: BrowserAiAction,
}

#[derive(Debug, Clone)]
pub enum BrowserAiAction {
    Summarize,
    Rewrite,
    CodeAssist,
}

#[derive(Debug, Clone)]
pub struct BrowserAiResponse {
    pub output: String,
    pub offline_capable: bool,
}

pub trait BrowserService: HealthService {
    fn evaluate_policy(&self, req: BrowserPolicyRequest) -> BrowserPolicyResponse;
    fn run_ai(&self, req: BrowserAiRequest) -> BrowserAiResponse;
}

impl fmt::Display for ServiceStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ServiceStatus::Healthy => write!(f, "healthy"),
            ServiceStatus::Degraded => write!(f, "degraded"),
            ServiceStatus::Unavailable => write!(f, "unavailable"),
        }
    }
}
