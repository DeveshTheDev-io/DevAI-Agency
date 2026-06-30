import re

with open(r'd:\Devscosmic.AI\DevAI-Agency\App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if 'AgentsPage' not in content:
    content = content.replace("import { HoverFooter } from './components/ui/hover-footer';", "import { HoverFooter } from './components/ui/hover-footer';\nimport { AgentsPage } from './components/ui/agents-page';")

# 2. Update state type
content = content.replace("useState<'home' | 'about'>('home');", "useState<'home' | 'about' | 'agents'>('home');")
content = content.replace("const navigateToPage = (page: 'home' | 'about') => {", "const navigateToPage = (page: 'home' | 'about' | 'agents') => {")

# 3. Remove the old agents section
pattern = re.compile(r'\s*\{\/\* Business Growth AI Agents Marketplace \*\/\}.*?<\/section>', re.DOTALL)
content = re.sub(pattern, '', content)

# 4. Add AgentsPage conditionally inside AnimatePresence
agents_page_jsx = """
          </motion.main>
        ) : currentPage === 'agents' ? (
          <motion.main
            key="agents-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 w-full relative"
          >
            <AgentsPage onOpenInquiry={openInquiryModal} />
          </motion.main>
        ) : null}
"""

content = content.replace("          </motion.main>\n        )}\n      </AnimatePresence>", agents_page_jsx + "      </AnimatePresence>")

with open(r'd:\Devscosmic.AI\DevAI-Agency\App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('App.tsx updated.')
