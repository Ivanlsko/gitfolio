import fs from "fs";
import { analyzeRepo } from "./test.js"
import { analyzeCode } from "./openai.js"

const username = 'ivanlsko'; // Replace 'octocat' with any GitHub username you want to fetch repositories for.

const GITHUB_API_URL = `https://api.github.com/users/${username}/repos`;

//await analyzeRepo(username, "vento-web")

fs.readFile('./output.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  analyzeCode(data)
});



//getGitHubRepos();

/* async function getGitHubRepos() {
    try {
        const response = await fetch(GITHUB_API_URL);
        
        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`Failed to fetch repos: ${response.status}`);
        }
        
        // Parse the JSON response
        const repos = await response.json();

        // Log the repositories
        console.log(`Repositories for ${username}:`);
        repos.forEach((repo, index) => {
            console.log(`${index + 1}. ${repo.name} - ${repo.html_url}`);
        });
    } catch (error) {
        console.error('Error fetching data from GitHub:', error);
    }
} */