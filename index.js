const github = require('@actions/github');

const { env } = process;
const myToken = env.GH_TOKEN || '';
const ORG = env.GH_ORG || '';
const WORKFLOWS_PER_REPO = 2;

const serializeWorkflow = workFlows => ({
  id: workFlows.id,
  name: workFlows.name,
  head_branch: workFlows.head_branch,
  run_number: workFlows.run_number,
  event: workFlows.event,
  status: workFlows.status,
  conclusion: workFlows.conclusion,
  workflow_id: workFlows.workflow_id,
  html_url: workFlows.html_url,
  pull_request_number: workFlows.pull_requests.length && workFlows.pull_requests[0].number,
  // pull_request: workFlows.pull_requests,
  created_at: workFlows.created_at,
  updated_at: workFlows.updated_at,
  run_attempt: workFlows.run_attempt,
  run_started_at: workFlows.run_started_at,
  // head_commit: workFlows.head_commit,
  ...(workFlows.head_commit ? {
    head_commit_message: workFlows.head_commit.message,
    head_commit_author_name: workFlows.head_commit.author.name,
    head_commit_author_email: workFlows.head_commit.author.email,
  } : {}),
});

async function run() {

  const octokit = github.getOctokit(myToken);

  try {

    let getRepos = async () => {
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
    const repos = await getRepos();

    const res = {};
    for (i = 0; i<repos.length; i++) {
      const { name, full_name } = repos[i];
      const {data: workFlows} = await octokit.rest.actions.listWorkflowRunsForRepo({
        owner: ORG,
        repo: name,
        per_page: WORKFLOWS_PER_REPO,
      });
      if (workFlows.total_count > 0) {
        res[full_name] = workFlows.workflow_runs.map(serializeWorkflow);
      }
    }
    console.log(JSON.stringify({ res }));

  } catch (e) {
    console.error(e)
  }
}

run();
