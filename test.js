import fs from "fs"
import path from "path"

// GitHub API URL to get repo content
const GITHUB_API_URL = 'https://api.github.com/repos';

// List of extensions to consider important
const importantExtensions = ['.js', '.ts', '.py', '.java', '.rb', '.cpp', '.vue', '.html'];

// GitHub API token (if you need to authenticate for private repos, add your token here)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''; // Set this as an environment variable

// Function to recursively fetch the content of the repository
async function fetchRepoContent(owner, repo, currentPath = '') {
  const url = `${GITHUB_API_URL}/${owner}/${repo}/contents/${currentPath}`;
  const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch repo content: ${response.statusText}`);
  }

  const content = await response.json();
  const files = [];

  // Process each item in the content (could be file or directory)
  for (const item of content) {
    if (item.type === 'file') {
      const ext = path.extname(item.name);
      if (importantExtensions.includes(ext)) {
        const fileContent = await fetchFileContent(item.download_url);
        files.push({ path: item.path, content: fileContent });
      }
    } else if (item.type === 'dir') {
      // Recursively fetch subdirectories
      const subDirFiles = await fetchRepoContent(owner, repo, item.path);
      files.push(...subDirFiles);
    }
  }

  return files;
}

// Fetches the actual file content from GitHub
async function fetchFileContent(downloadUrl) {
  const response = await fetch(downloadUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch file content: ${response.statusText}`);
  }

  return await response.text();
}

// Write the fetched files into a single text file
function writeFilesToTxt(files, outputFile) {
  const content = files
    .map((file) => `\n\n### ${file.path}\n\n${file.content}`)
    .join('\n');

  fs.writeFileSync(outputFile, content, 'utf-8');
}

// Main function to execute the process
export async function analyzeRepo(owner, repo, outputFile = 'output.txt') {
  try {
    console.log(`Fetching repo content for ${owner}/${repo}...`);
    const files = await fetchRepoContent(owner, repo);
    writeFilesToTxt(files, outputFile);
    console.log('Repo analysis completed!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}


