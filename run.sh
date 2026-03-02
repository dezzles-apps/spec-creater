#!/bin/bash

# Spec Creator Runner Script
# Usage: ./run.sh <version> <spec-file> [environments]
# Example: ./run.sh 1.0.0 test/my-spec.yml dev,prod

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print usage
usage() {
    cat << EOF
Usage: ./run.sh <version> <spec-file> [environments]

Arguments:
  version        Version number to insert into the spec (required)
  spec-file      Path to the spec YAML/JSON file (required)
  environments   Comma-separated list of environments (optional, comma-separated)

Examples:
  ./run.sh 1.0.0 specs/my-app.yml
  ./run.sh 1.0.0 specs/my-app.yml dev,prod
  ./run.sh 2.1.0 ./my-spec.json dev,staging,uat,prod

EOF
    exit 1
}

# Check if at least 2 arguments provided
if [ $# -lt 2 ]; then
    echo -e "${RED}Error: Missing required arguments${NC}"
    usage
fi

VERSION="$1"
SPEC_FILE="$2"

# Validate spec file exists
if [ ! -f "$SPEC_FILE" ]; then
    echo -e "${RED}Error: Spec file not found: $SPEC_FILE${NC}"
    exit 1
fi

# Validate version format (basic check)
if [ -z "$VERSION" ]; then
    echo -e "${RED}Error: Version cannot be empty${NC}"
    exit 1
fi

echo -e "${YELLOW}Running Spec Creator...${NC}"
echo "Version: $VERSION"
echo "Spec File: $SPEC_FILE"

# Set environment variables and run the action
export INPUT_VERSION="$VERSION"
export INPUT_SPEC="$SPEC_FILE"

# Run the node script
if node dist/index.js; then
    echo ""
    echo -e "${GREEN}✓ Spec Creator completed successfully${NC}"
    echo -e "${GREEN}✓ Generated specs in the 'specs/' directory${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}✗ Spec Creator failed${NC}"
    exit 1
fi
