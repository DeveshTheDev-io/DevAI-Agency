import os

path = r'd:\Devscosmic.AI\DevAI-Agency\App.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """          </motion.main>
        )}
      </AnimatePresence>"""

replacement = """          </motion.main>
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
      </AnimatePresence>"""

if target in content:
    content = content.replace(target, replacement)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed App.tsx successfully.")
else:
    print("Target string not found in App.tsx")
