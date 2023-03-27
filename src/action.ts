import * as fs from "node:fs";
import { sarifToMarkdown } from "@security-alert/sarif-to-markdown";
import { join } from "node:path";
import * as core from '@actions/core';
import * as github from '@actions/github';
import { argv0 } from "node:process";

const sarifReport = core.getInput('input');
const sarifContent = JSON.parse(fs.readFileSync(sarifReport, "utf-8"));
const repo = process.env.GITHUB_REPOSITORY?.split('/') ?? ['not', 'defined']
const options = {
	owner: repo[0],
	repo: repo[1],
	branch: process.env.GITHUB_HEAD_REF ?? "main",
	sourceRoot: ''
};
const actualResults = sarifToMarkdown(options)(sarifContent);
const actualResultsMd = actualResults.map((result) => result.body).join("\n\n---\n\n");
console.log(actualResultsMd)
fs.writeFileSync(join(__dirname, core.getInput('output')), 'utf-8')
