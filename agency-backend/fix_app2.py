import os

path = r'd:\Devscosmic.AI\DevAI-Agency\App.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the else branch to be else if about
target1 = """          </motion.main>
        ) : (
          <motion.div
            key="about-page\""""

replacement1 = """          </motion.main>
        ) : currentPage === 'about' ? (
          <motion.div
            key="about-page\""""

content = content.replace(target1, replacement1)

# Fix the end of the about page and add the agents page correctly
target2 = """              <Accordion05 />
            </div>
          </motion.main>
        ) : currentPage === 'agents' ? ("""

replacement2 = """              <Accordion05 />
            </div>
          </motion.div>
        ) : currentPage === 'agents' ? ("""

content = content.replace(target2, replacement2)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed App.tsx successfully.")
