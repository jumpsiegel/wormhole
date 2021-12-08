all: vaa-processor-approval.teal vaa-processor-clear.teal vaa-verify.teal

vaa-processor-approval.teal vaa-processor-clear.teal: pyteal/vaa-processor.py
	python3 pyteal/vaa-processor.py vaa-processor-approval.teal vaa-processor-clear.teal

vaa-verify.teal: pyteal/vaa-verify.py
	python3 pyteal/vaa-verify.py 0 vaa-verify.teal

