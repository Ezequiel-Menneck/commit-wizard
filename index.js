import "dotenv/config";
import { Octokit, App } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_KEY,
});

const owner = "Ezequiel-Menneck";
const repo = "commits-from-gitlab";
const message = "Commit";
const author = {
  name: "Ezequiel Menneck",
  email: "zeeeee.peeeeetryyy@gmail.com",
  date: new Date().getDay,
};

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
  content: 'Test blob',
  encoding: 'utf-8',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})

const createTree = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
  owner: owner,
  repo: repo,
  base_tree: getCommit.data.tree.sha,
  tree: [
    {
      path: 'tree.md',
      mode: '100644',
      type: 'blob',
      sha: createBlob.data.sha
    }
  ],
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})

const today = new Date().getDate.toString;

const createCommit = await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
  owner: owner,
  repo: repo,
  message: 'Automated Commit',
  author: {
    name: 'menneck',
    email: 'zeeeee.peeeeetryyy@gmail.com',
    date: today
  },
  // parents: [
  //   '7d1b31e74ee336d15cbd21741bc88a537ed063a0'
  // ],
  tree: createTree.data.sha,
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})

// const updateRef = await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
//   owner: owner,
//   repo: repo,
//   ref: 'heads/master',
//   sha: createCommit.data.sha,
//   force: true,
//   headers: {
//     'X-GitHub-Api-Version': '2022-11-28'
//   }
// })





console.log(getRef);
console.log('----------------------------------------------');
console.log(getCommit);
console.log('----------------------------------------------');
console.log(createBlob);
console.log('----------------------------------------------');
console.log(createTree);
console.log('----------------------------------------------');
console.log(createCommit);
console.log('----------------------------------------------');
// console.log(updateRef)