const github = require('@actions/github');

const { env } = process;
const myToken = env.GH_TOKEN || '';
const ORG = env.GH_ORG || '';
const WORKFLOWS_PER_REPO = 2;

const serializeWorkflow = (repo) => workFlow => ({
  _repo_name: repo.name,
  _repo_full_name: repo.full_name,
  id: workFlow.id,
  name: workFlow.name,
  head_branch: workFlow.head_branch,
  run_number: workFlow.run_number,
  event: workFlow.event,
  status: workFlow.status,
  conclusion: workFlow.conclusion,
  workflow_id: workFlow.workflow_id,
  html_url: workFlow.html_url,
  pull_request_number: workFlow.pull_requests.length && workFlow.pull_requests[0].number,
  // pull_request: workFlow.pull_requests,
  created_at: workFlow.created_at,
  updated_at: workFlow.updated_at,
  run_attempt: workFlow.run_attempt,
  run_started_at: workFlow.run_started_at,
  // head_commit: workFlow.head_commit,
  ...(workFlow.head_commit ? {
    head_commit_message: workFlow.head_commit.message,
    head_commit_author_name: workFlow.head_commit.author.name,
    head_commit_author_email: workFlow.head_commit.author.email,
  } : {}),
});

const getRepos = async () => {
  const allRes = [];
  let page = 0;
  let res = ['init'];

  while (res && res.length !== 0) {
    ({data: res} = await octokit.rest.repos.listForOrg({
      org: ORG,
      type: 'all',
      per_page: 100,
      page: page,
    }));
    page = page + 1;
    allRes.push(...res)
  }
  return allRes;
};

const getWorkflowsForRepos = async function (repos, octokit) {
  const res = {};
  for (i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const {name, full_name} = repo;
    const {data: workFlows} = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner: ORG,
      repo: name,
      per_page: WORKFLOWS_PER_REPO,
    });
    if (workFlows.total_count > 0) {
      res[full_name] = workFlows.workflow_runs.map(serializeWorkflow(repo));
    }
  }
  return res;
};

async function run() {

  const octokit = github.getOctokit(myToken);

  try {
    const repos = await getRepos();
    const repoToWorkflows = await getWorkflowsForRepos(repos, octokit);
    console.log(JSON.stringify({ repoToWorkflows }));

  } catch (e) {
    console.error(e)
  }
}

run();
