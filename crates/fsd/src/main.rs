use platform_contracts::{
    FsCompatRequest, FsCompatResponse, FsCompatService, HealthRequest, HealthResponse, HealthService,
    CONTRACT_VERSION, ServiceStatus,
};
use std::collections::HashMap;
use std::fs;
use std::io;
use std::path::PathBuf;

const SERVICE: &str = "fsd";

#[derive(Clone, Debug)]
struct AclEntry {
    principal: String,
    perms: String,
}

struct FsDaemon {
    acl_map: HashMap<String, Vec<AclEntry>>,
    acl_path: PathBuf,
}

impl FsDaemon {
    fn default_acl_path() -> PathBuf {
        if let Ok(path) = std::env::var("ASTER_FSD_ACL_PATH") {
            return PathBuf::from(path);
        }
        let home = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
        PathBuf::from(home).join(".asteros").join("fs-acl.db")
    }

    fn load() -> Self {
        let acl_path = Self::default_acl_path();
        let mut d = Self {
            acl_map: HashMap::new(),
            acl_path,
        };

        let users_path = Self::normalize_windows_path("C:\\Users\\Demo");
        d.acl_map.insert(
            users_path,
            vec![AclEntry {
                principal: "DemoUser".to_string(),
                perms: "rwx".to_string(),
            }],
        );

        if let Ok(raw) = fs::read_to_string(&d.acl_path) {
            d.acl_map.clear();
            for line in raw.lines() {
                if line.trim().is_empty() || line.starts_with('#') {
                    continue;
                }
                let parts: Vec<&str> = line.split('\t').collect();
                if parts.len() == 3 {
                    d.acl_map
                        .entry(parts[0].to_string())
                        .or_default()
                        .push(AclEntry {
                            principal: parts[1].to_string(),
                            perms: parts[2].to_string(),
                        });
                }
            }
        } else {
            let _ = d.save();
        }

        d
    }

    fn save(&self) -> io::Result<()> {
        if let Some(parent) = self.acl_path.parent() {
            fs::create_dir_all(parent)?;
        }
        let mut lines: Vec<String> = Vec::new();
        let mut keys: Vec<String> = self.acl_map.keys().cloned().collect();
        keys.sort();
        for key in keys {
            if let Some(entries) = self.acl_map.get(&key) {
                for e in entries {
                    lines.push(format!("{}\t{}\t{}", key, e.principal, e.perms));
                }
            }
        }
        fs::write(&self.acl_path, lines.join("\n"))
    }

    fn normalize_windows_path(path: &str) -> String {
        let mut raw = path.trim().replace('\\', "/");
        if raw.is_empty() {
            return "C:/".to_string();
        }

        let mut drive = 'C';
        if raw.len() >= 2 && raw.as_bytes()[1] == b':' {
            drive = raw.chars().next().unwrap_or('C').to_ascii_uppercase();
            raw = raw[2..].to_string();
        }

        let mut segments: Vec<&str> = Vec::new();
        for seg in raw.split('/') {
            if seg.is_empty() || seg == "." {
                continue;
            }
            if seg == ".." {
                let _ = segments.pop();
                continue;
            }
            segments.push(seg);
        }

        let mut canonical = format!("{}:/", drive);

        if !segments.is_empty() {
            if canonical.ends_with('/') {
                canonical.push_str(&segments.join("/"));
            } else {
                canonical.push('/');
                canonical.push_str(&segments.join("/"));
            }
        }

        canonical
    }

    fn get_acl(&self, path: &str) -> Vec<AclEntry> {
        let canonical = Self::normalize_windows_path(path);
        self.acl_map.get(&canonical).cloned().unwrap_or_default()
    }

    fn set_acl(&mut self, path: &str, principal: &str, perms: &str) -> io::Result<()> {
        let canonical = Self::normalize_windows_path(path);
        let entries = self.acl_map.entry(canonical).or_default();
        if let Some(existing) = entries.iter_mut().find(|e| e.principal.eq_ignore_ascii_case(principal)) {
            existing.perms = perms.to_string();
        } else {
            entries.push(AclEntry {
                principal: principal.to_string(),
                perms: perms.to_string(),
            });
        }
        self.save()
    }
}

impl HealthService for FsDaemon {
    fn health(&self, req: HealthRequest) -> HealthResponse {
        HealthResponse {
            service: req.service,
            status: ServiceStatus::Healthy,
            contract_version: CONTRACT_VERSION,
        }
    }
}

impl FsCompatService for FsDaemon {
    fn normalize_path(&self, req: FsCompatRequest) -> FsCompatResponse {
        let canonical = Self::normalize_windows_path(&req.path);
        FsCompatResponse {
            canonical_path: canonical,
            case_insensitive_view: true,
        }
    }
}

fn main() {
    let mut d = FsDaemon::load();
    let args: Vec<String> = std::env::args().collect();

    if args.iter().any(|a| a == "--health") {
        let h = d.health(HealthRequest { service: SERVICE });
        println!("{}:{}:{}", h.service, h.status, h.contract_version);
        return;
    }

    if args.len() > 2 && args[1] == "normalize" {
        let out = d.normalize_path(FsCompatRequest {
            path: args[2..].join(" "),
        });
        println!("canonical={} ci={}", out.canonical_path, out.case_insensitive_view);
        return;
    }

    if args.len() == 3 && args[1] == "acl-get" {
        let entries = d.get_acl(&args[2]);
        if entries.is_empty() {
            println!("acl=[]");
        } else {
            for e in entries {
                println!("principal={} perms={}", e.principal, e.perms);
            }
        }
        return;
    }

    if args.len() == 5 && args[1] == "acl-set" {
        match d.set_acl(&args[2], &args[3], &args[4]) {
            Ok(_) => println!("ok=true"),
            Err(e) => println!("ok=false error={}", e),
        }
        return;
    }

    if args.len() > 1 {
        let out = d.normalize_path(FsCompatRequest {
            path: args[1..].join(" "),
        });
        println!("canonical={} ci={}", out.canonical_path, out.case_insensitive_view);
        return;
    }

    println!(
        "{SERVICE} usage:\n  fsd --health\n  fsd <path>\n  fsd normalize <path>\n  fsd acl-get <path>\n  fsd acl-set <path> <principal> <perms>"
    );
}
