.PHONY: bootstrap-rust build run-compatd run-updated run-aid run-shelld run-regd run-fsd run-browserd test-harness run-extractx pycheck smoke-extractx package-preview build-iso-linux write-usb-linux write-usb-macos vm-test

bootstrap-rust:
	bash scripts/bootstrap-rust.sh

build:
	cargo build --workspace

run-compatd:
	cargo run -p compatd -- --health

run-updated:
	cargo run -p updated -- --health

run-aid:
	cargo run -p aid -- --health

run-shelld:
	cargo run -p shelld -- --health

run-regd:
	cargo run -p regd -- --health

run-fsd:
	cargo run -p fsd -- --health

run-browserd:
	cargo run -p browserd -- --health

test-harness:
	bash testing/harness/run_compat.sh

run-extractx:
	python3 apps/extractx/extractx.py

pycheck:
	python3 -m py_compile apps/extractx/extractx.py

smoke-extractx:
	bash testing/extractx/smoke_extractx.sh

package-preview:
	bash installer/scripts/build-dev-preview.sh

build-iso-linux:
	bash installer/scripts/build-iso-linux.sh

write-usb-linux:
	@echo "Usage: bash installer/usb/write-usb-linux.sh <iso-path> <usb-device>"

write-usb-macos:
	@echo "Usage: bash installer/usb/write-usb-macos.sh <iso-path> <disk-id>"

vm-test:
	@echo "Usage: bash installer/scripts/test-in-qemu.sh <installer.iso|disk.img> [ram_mb] [cpus]"
