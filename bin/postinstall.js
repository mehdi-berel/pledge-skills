#!/usr/bin/env node

// Post-install message
console.log(`
pledge-skills installed!

To add skills to your agent, run:
  npx pledge-skills list          # See available skills
  npx pledge-skills add all       # Install all skills
  npx pledge-skills add nextjs    # Install specific skill

Available skills:
  - nextjs
  - react
  - typescript
  - tailwindcss
`);
