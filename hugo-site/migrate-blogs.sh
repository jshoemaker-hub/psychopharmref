#!/bin/bash

###############################################################################
# PsychoPharmRef Blog Migration Script
# Converts HTML blog posts to Hugo Markdown content files
#
# Usage:
#   ./migrate-blogs.sh /path/to/blog/directory
#
# This script reads HTML blog files from the source directory and converts
# them to Hugo Markdown files in content/blog/
###############################################################################

set -e

# Configuration
SOURCE_BLOG_DIR="${1:-./../blog}"
DEST_BLOG_DIR="./content/blog"
TEMP_DIR="/tmp/blog-migration-$$"

# Create directories
mkdir -p "$DEST_BLOG_DIR"
mkdir -p "$TEMP_DIR"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
MIGRATED=0
FAILED=0

###############################################################################
# Helper function to extract text between HTML tags
###############################################################################
extract_tag() {
    local content="$1"
    local tag="$2"
    echo "$content" | grep -oP "(?<=<${tag}[^>]*>).*?(?=</${tag}>)" | head -1 | sed 's/<[^>]*>//g' | sed 's/&quot;/"/g' | sed 's/&amp;/\&/g' | sed 's/&#8217;/'\''/g' | sed 's/&lt;/</g' | sed 's/&gt;/>/g'
}

extract_meta() {
    local content="$1"
    local name="$2"
    echo "$content" | grep -oP "(?<=<meta name=\"${name}\" content=\")[^\"]*" | head -1
}

extract_og() {
    local content="$1"
    local property="$2"
    echo "$content" | grep -oP "(?<=<meta property=\"${property}\" content=\")[^\"]*" | head -1
}

###############################################################################
# Extract content from ba-body div
###############################################################################
extract_ba_body() {
    local content="$1"
    # Extract everything from <div class="ba-body"> to closing </div>
    # This is a simplified extraction; more complex parsing may be needed
    echo "$content" | sed -n '/<div class="ba-body">/,/<\/div>/p' | head -n -1 | tail -n +2
}

###############################################################################
# Convert HTML file to Markdown
###############################################################################
convert_html_to_markdown() {
    local html_file="$1"
    local basename=$(basename "$html_file" .html)
    local md_file="$DEST_BLOG_DIR/${basename}.md"

    echo -n "Processing $(basename "$html_file")... "
    TOTAL=$((TOTAL + 1))

    # Read HTML file
    if [ ! -f "$html_file" ]; then
        echo -e "${RED}FAILED${NC} (file not found)"
        FAILED=$((FAILED + 1))
        return 1
    fi

    local html_content=$(cat "$html_file")

    # Extract front matter
    local title=$(extract_tag "$html_content" "title" | sed 's/ - PsychoPharmRef//' | tr '&' '\&')
    local description=$(extract_meta "$html_content" "description")
    local category=$(echo "$html_content" | grep -oP '(?<=<span class="ba-category">)[^<]*' | head -1)
    local subtitle=$(echo "$html_content" | grep -oP '(?<=<p class="ba-subtitle">)[^<]*' | head -1)
    local date_published=$(echo "$html_content" | grep -oP '(?<="datePublished": ")[^"]*' | head -1)

    # Fallback to date from meta if not found in JSON-LD
    if [ -z "$date_published" ]; then
        date_published="2026-03-01"
    fi

    # Extract read time
    local read_time=$(echo "$html_content" | grep -oP '(?<=⏱️ )[^<]*' | head -1)
    if [ -z "$read_time" ]; then
        read_time="15 min read"
    fi

    # Extract clinical summary from ba-clinical-summary div if present
    local clinical_summary=$(echo "$html_content" | sed -n '/<div class="ba-clinical-summary">/,/<\/div>/p' | sed 's/<[^>]*>//g' | sed -n '2p' | xargs)

    # Extract related posts (simplified - extract from ba-related-grid)
    local related_posts=$(echo "$html_content" | grep -oP 'href="\K[^"]*(?=.*?"ba-related-link)' | sed 's/.html//g' | sed "s|^|\"" | sed "s|$|\"|" | paste -sd, -)

    # Build front matter
    local front_matter="---
title: \"${title}\"
date: ${date_published}
description: \"${description}\"
category: \"${category}\"
subtitle: \"${subtitle}\"
readTime: \"${read_time}\"
clinicalSummary: \"${clinical_summary}\"
related: [${related_posts}]
draft: false
---"

    # Extract body content (simplified)
    local body_content=$(extract_ba_body "$html_content")

    # Write markdown file
    {
        echo "$front_matter"
        echo ""
        # Convert basic HTML to Markdown (simplified conversion)
        echo "$body_content" | \
            sed 's/<h2 class="ba-h2">/## /g' | \
            sed 's/<h3 class="ba-h3">/### /g' | \
            sed 's/<\/h[2-3]>//g' | \
            sed 's/<p class="ba-paragraph">//g' | \
            sed 's/<p class="ba-lead">//g' | \
            sed 's/<\/p>//g' | \
            sed 's/<span class="reference">\[/<span class="reference">[/g' | \
            sed 's/<strong>/\*\*/g' | \
            sed 's/<\/strong>/\*\*/g' | \
            sed 's/<em>/\*/g' | \
            sed 's/<\/em>/\*/g'
    } > "$md_file"

    echo -e "${GREEN}OK${NC}"
    MIGRATED=$((MIGRATED + 1))
}

###############################################################################
# Main execution
###############################################################################

echo "PsychoPharmRef Blog Migration Script"
echo "===================================="
echo ""
echo "Source:      $SOURCE_BLOG_DIR"
echo "Destination: $DEST_BLOG_DIR"
echo ""

# Check if source directory exists
if [ ! -d "$SOURCE_BLOG_DIR" ]; then
    echo -e "${RED}ERROR: Source blog directory not found: $SOURCE_BLOG_DIR${NC}"
    exit 1
fi

# Count HTML files
HTML_COUNT=$(find "$SOURCE_BLOG_DIR" -maxdepth 1 -name "*.html" -type f | wc -l)
echo "Found $HTML_COUNT blog posts to migrate"
echo ""

# Process each HTML file
for html_file in "$SOURCE_BLOG_DIR"/*.html; do
    if [ -f "$html_file" ]; then
        convert_html_to_markdown "$html_file"
    fi
done

# Clean up
rm -rf "$TEMP_DIR"

# Summary
echo ""
echo "===================================="
echo "Migration Complete"
echo "===================================="
echo -e "Total:    $TOTAL"
echo -e "Migrated: ${GREEN}$MIGRATED${NC}"
echo -e "Failed:   ${RED}$FAILED${NC}"
echo ""
echo "Next steps:"
echo "1. Review generated Markdown files in $DEST_BLOG_DIR/"
echo "2. Edit front matter and content as needed"
echo "3. Test with: hugo server -D"
echo "4. Build with: hugo --minify"
echo ""
