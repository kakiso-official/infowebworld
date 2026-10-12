import CodeBlock from '../ui/CodeBlock'
import DvExternalLink from '../ui/DvExternalLink'

/* ═══════════════════════════════════════════════════════════════════════
   "How to contribute" steps (spec 3.7, 3.12).

     variant="repo"    4 steps for one repository: its GitHub /contribute
                       page (a route GitHub serves for every repository,
                       never a guessed CONTRIBUTING path), comment first,
                       fork and clone, open a pull request.
     variant="issues"  5 steps for a first contribution, with a real
                       `git clone` of an example repository.

   contributeSteps() is the single source for the visible list AND the
   HowTo JSON-LD on the good-first-issues pages, so the two never drift.
   ═══════════════════════════════════════════════════════════════════════ */

export interface ContributeStep {
  name: string
  text: string
  /** Link that belongs to the step (GitHub's contribute page). */
  url?: string
  urlLabel?: string
  code?: string
}

export interface ContributeRepo {
  nameWithOwner: string
  /** The repository's GitHub URL. */
  url: string
}

/** The steps for a variant (see the file header). */
export function contributeSteps(variant: 'repo' | 'issues', repo: ContributeRepo | null): ContributeStep[] {
  const clone = repo ? `git clone https://github.com/${repo.nameWithOwner}.git` : undefined
  if (variant === 'repo') {
    return [
      {
        name: 'Find an issue',
        text: 'Open the repository\'s contribute page on GitHub. It lists good first issues and links the contributing guide when the project has one.',
        ...(repo ? { url: `${repo.url}/contribute`, urlLabel: 'Open the contribute page' } : {}),
      },
      {
        name: 'Comment before you start',
        text: 'Say on the issue that you would like to work on it, and wait for a maintainer to reply, so two people do not fix the same thing.',
      },
      {
        name: 'Fork and clone',
        text: 'Fork the repository on GitHub, then clone your fork. To read the code first, clone the original:',
        ...(clone ? { code: clone } : {}),
      },
      {
        name: 'Open a pull request',
        text: 'Commit your change on a new branch, push it to your fork and open a pull request that links the issue.',
      },
    ]
  }
  return [
    {
      name: 'Pick an issue',
      text: 'Choose an issue in a language you know. A short, clear issue in an active project is the best first step.',
    },
    {
      name: 'Read the thread and comment',
      text: 'Read the whole issue, then say you would like to work on it and wait for a maintainer to reply before you start.',
    },
    {
      name: 'Fork and clone',
      text: repo
        ? `Fork the repository on GitHub, then clone your fork. Cloning ${repo.nameWithOwner} looks like this:`
        : 'Fork the repository on GitHub, then clone your fork to your computer.',
      ...(clone ? { code: clone } : {}),
    },
    {
      name: 'Make the change on a branch',
      text: 'Create a branch, make the smallest change that fixes the issue and run the project\'s tests.',
      code: 'git checkout -b my-first-fix',
    },
    {
      name: 'Open a pull request',
      text: 'Push the branch to your fork and open a pull request that links the issue. Maintainers often ask for small changes; that is normal.',
    },
  ]
}

export interface ContributeStepsProps {
  steps: readonly ContributeStep[]
  /** Heading level of each step title (default 3). */
  headingLevel?: 3 | 4
  className?: string
}

export default function ContributeSteps({ steps, headingLevel = 3, className }: ContributeStepsProps) {
  const Heading = headingLevel === 4 ? 'h4' : 'h3'
  return (
    <ol className={`dv-steps${className ? ` ${className}` : ''}`}>
      {steps.map((s, i) => (
        <li key={s.name} className="dv-step">
          <span className="dv-step-n" aria-hidden="true">{i + 1}</span>
          <div className="dv-step-body">
            <Heading className="dv-step-title">{s.name}</Heading>
            <p className="dv-step-text">{s.text}</p>
            {s.code && <CodeBlock code={s.code} lang="shell" compact />}
            {s.url && (
              <p className="dv-step-link">
                <DvExternalLink href={s.url}>{s.urlLabel ?? s.url}</DvExternalLink>
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
