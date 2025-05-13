import { execSync } from 'child_process';

export function getCommitInfo() {
  try {
    const commitId = execSync('git rev-parse --short HEAD').toString().trim();
    const commitDate = execSync('git log -1 --format=%cd --date=iso-strict').toString().trim();
    return { commitId, commitDate };
  } catch (error) {
    console.error('Erro ao buscar informações do commit:', error);
    return { commitId: 'unknown', commitDate: 'unknown' };
  }
}
