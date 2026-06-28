import os
from github import Github
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")

class GitHubIntegration:
    def __init__(self):
        if not GITHUB_TOKEN:
            print("Warning: GITHUB_TOKEN missing from .env")
            self.g = None
        else:
            self.g = Github(GITHUB_TOKEN)
        
    def get_repo(self, repo_name: str):
        if not self.g: return None
        return self.g.get_repo(repo_name)

    def create_branch(self, repo_name: str, base_branch: str, new_branch: str):
        repo = self.get_repo(repo_name)
        if not repo: return None
        sb = repo.get_branch(base_branch)
        return repo.create_git_ref(ref=f"refs/heads/{new_branch}", sha=sb.commit.sha)

    def commit_file(self, repo_name: str, branch: str, filepath: str, content: str, message: str):
        repo = self.get_repo(repo_name)
        if not repo: return None
        try:
            contents = repo.get_contents(filepath, ref=branch)
            repo.update_file(contents.path, message, content, contents.sha, branch=branch)
        except Exception:
            repo.create_file(filepath, message, content, branch=branch)

    def create_pr(self, repo_name: str, title: str, body: str, head: str, base: str):
        repo = self.get_repo(repo_name)
        if not repo: return None
        return repo.create_pull(title=title, body=body, head=head, base=base)

gh_layer = GitHubIntegration()
