import "dotenv/config";
import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_KEY,
});

const owner = "Ezequiel-Menneck";
const repo = "commits-from-gitlab";
const author = {
  name: "Ezequiel Menneck",
  email: "zeeeee.peeeeetryyy@gmail.com",
  date: new Date().getDay,
};

for(let i = 0; i < 2; i++) {
  const getRef = await octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
    owner: owner,
    repo: repo,
    ref: 'heads/master',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  
  const getCommit = await octokit.request('GET /repos/{owner}/{repo}/git/commits/{commit_sha}', {
    owner: owner,
    repo: repo,
    commit_sha: getRef.data.object.sha,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  
  const createBlob = await octokit.request('POST /repos/{owner}/{repo}/git/blobs', {
    owner: owner,
    repo: repo,
    content: `Commit número ${i + 1}`,
    encoding: 'utf-8',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  
  const createTree = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
    owner: owner,
    repo: repo,
    base_tree: getCommit.data.sha,
    tree: [
      {
        path: 'commits.md',
        mode: '100644',
        type: 'blob',
        sha: createBlob.data.sha
      }
    ],
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  
  const createCommit = await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
    owner: owner,
    repo: repo,
    message: 'Automated Commit',
    author: author,
    parents: [
      getCommit.data.sha
    ],
    tree: createTree.data.sha,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  
  await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
    owner: owner,
    repo: repo,
    ref: 'heads/master',
    sha: createCommit.data.sha,
    force: true,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  console.log(`Commit nums: ${i + 1}`)
}

