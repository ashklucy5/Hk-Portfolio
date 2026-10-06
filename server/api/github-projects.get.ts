type GithubRepo = {
  id: number
  name: string
  description: string | null

  html_url: string
  homepage: string | null

  language: string | null
  topics?: string[]

  stargazers_count: number

  fork: boolean
  archived: boolean

  pushed_at: string
}

type Project = {
  id: number

  name: string
  description: string | null

  url: string
  homepage: string | null

  image: string | null

  language: string | null
  topics: string[]

  stars: number
}

type ProjectOverride = {
  title?: string
  description?: string
  homepage?: string
  image?: string
}

/*
 * =========================================================
 * FEATURED PROJECTS
 * =========================================================
 *
 * These are the only repositories shown.
 * Order here = order on the portfolio.
 */

const FEATURED_REPOSITORIES = [
  'e-commerce',
  'task-manager_flutter',
  'sorcerer',
  'task_manager'
] as const

/*
 * =========================================================
 * PORTFOLIO PRESENTATION
 * =========================================================
 */

const PROJECT_OVERRIDES:
  Record<string, ProjectOverride> = {
    'e-commerce': {
      title:
        'E-Commerce Platform',

      description:
        'Full-stack commerce platform covering product discovery, sourcing, checkout, payments, administration and operational workflows.',

      homepage:
        'https://frontend-ecru-ten-70st7vvrxx.vercel.app/',

      image:
        '/projects/e-commerce.webp'
    },

    'task-manager_flutter': {
      title:
        'Task Manager Mobile',

      description:
        'Cross-platform Flutter application for secure task distribution, workflow management and backend-connected team operations.',

      image:
        '/projects/task-manager-flutter.webp'
    },

    'sorcerer': {
      title:
        'Sorcerer',

      description:
        'Software project focused on practical automation and streamlined digital workflows.',

      image:
        '/projects/sorcerer.webp'
    },

    'task_manager': {
      title:
        'Task Manager',

      description:
        'Task management system designed around structured workflows, productivity and operational clarity.',

      image:
        '/projects/task-manager.webp'
    }
  }

/*
 * =========================================================
 * FETCH ONE GITHUB REPOSITORY
 * =========================================================
 *
 * If a token exists:
 *
 * 1. Try authenticated request.
 * 2. If that fails, retry without the token.
 *
 * This means a broken token cannot prevent
 * public portfolio repositories from loading.
 */

const fetchRepository = async (
  username: string,
  repoName: string,
  token: string
): Promise<GithubRepo> => {
  const url =
    `https://api.github.com/repos/${encodeURIComponent(
      username
    )}/${encodeURIComponent(
      repoName
    )}`

  const baseHeaders:
    Record<string, string> = {
      Accept:
        'application/vnd.github+json',

      'X-GitHub-Api-Version':
        '2022-11-28',

      'User-Agent':
        'hasan-kumrul-portfolio'
    }

  /*
   * No token?
   *
   * Just use GitHub's public API.
   */
  if (!token) {
    return await $fetch<GithubRepo>(
      url,
      {
        headers:
          baseHeaders
      }
    )
  }

  /*
   * First attempt:
   * authenticated.
   */
  try {
    return await $fetch<GithubRepo>(
      url,
      {
        headers: {
          ...baseHeaders,

          Authorization:
            `Bearer ${token}`
        }
      }
    )
  } catch (error) {
    /*
     * The selected portfolio repositories
     * are public, so an invalid/expired token
     * should not break the portfolio.
     */

    console.warn(
      `[GitHub Projects] Authenticated request failed for ${repoName}. Retrying publicly.`
    )

    return await $fetch<GithubRepo>(
      url,
      {
        headers:
          baseHeaders
      }
    )
  }
}

export default defineCachedEventHandler(
  async () => {
    const config =
      useRuntimeConfig()

    const username =
      String(
        config.public.githubUsername ||
        'ashklucy5'
      ).trim()

    if (!username) {
      return {
        username: '',

        projects:
          [] as Project[],

        configured:
          false,

        error:
          'GitHub username is not configured.'
      }
    }

    /*
     * Server-only token.
     *
     * This may be empty.
     */
    const token =
      String(
        config.githubToken ||
        ''
      ).trim()

    try {
      /*
       * ===================================================
       * FETCH EXACTLY FOUR REPOSITORIES
       * ===================================================
       */

      const results =
        await Promise.allSettled(
          FEATURED_REPOSITORIES.map(
            (repoName) =>
              fetchRepository(
                username,
                repoName,
                token
              )
          )
        )

      /*
       * Log individual failures rather than
       * making one repository kill everything.
       */

      results.forEach(
        (
          result,
          index
        ) => {
          if (
            result.status ===
            'rejected'
          ) {
            console.error(
              `[GitHub Projects] Failed repository: ${FEATURED_REPOSITORIES[index]}`,
              result.reason
            )
          }
        }
      )

      /*
       * Successful GitHub responses.
       */

      const loadedRepositories =
        results
          .filter(
            (
              result
            ): result is PromiseFulfilledResult<GithubRepo> =>
              result.status ===
              'fulfilled'
          )
          .map(
            (result) =>
              result.value
          )

      /*
       * ===================================================
       * PRESERVE FEATURED ORDER
       * ===================================================
       */

      const orderedRepositories =
        FEATURED_REPOSITORIES
          .map(
            (repoName) =>
              loadedRepositories.find(
                (repo) =>
                  repo.name ===
                  repoName
              )
          )
          .filter(
            (
              repo
            ): repo is GithubRepo =>
              Boolean(repo)
          )

      /*
       * ===================================================
       * MAP TO PORTFOLIO PROJECTS
       * ===================================================
       */

      const projects:
        Project[] =
          orderedRepositories
            .filter(
              (repo) =>
                !repo.archived
            )
            .map(
              (
                repo
              ): Project => {
                const override =
                  PROJECT_OVERRIDES[
                    repo.name
                  ]

                return {
                  id:
                    repo.id,

                  name:
                    override?.title ??
                    repo.name,

                  description:
                    override?.description ??
                    repo.description,

                  /*
                   * GitHub source.
                   */
                  url:
                    repo.html_url,

                  /*
                   * Live project.
                   */
                  homepage:
                    override?.homepage ??
                    repo.homepage ??
                    null,

                  /*
                   * Curated screenshot.
                   */
                  image:
                    override?.image ??
                    null,

                  language:
                    repo.language,

                  topics:
                    repo.topics ??
                    [],

                  stars:
                    repo.stargazers_count
                }
              }
            )

      /*
       * ===================================================
       * NOTHING LOADED
       * ===================================================
       */

      if (
        projects.length ===
        0
      ) {
        return {
          username,

          projects:
            [] as Project[],

          configured:
            true,

          error:
            'The selected GitHub repositories could not be loaded.'
        }
      }

      /*
       * Partial success is okay.
       *
       * For example, if 3/4 repositories load,
       * show those three rather than breaking
       * the whole section.
       */

      return {
        username,

        projects,

        configured:
          true,

        error:
          null
      }
    } catch (error) {
      console.error(
        '[GitHub Projects] Unexpected failure:',
        error
      )

      return {
        username,

        projects:
          [] as Project[],

        configured:
          true,

        error:
          'GitHub projects could not be loaded right now.'
      }
    }
  },

  {
    /*
     * Changed again so an old failed response
     * cannot remain cached.
     */
    name:
      'github-projects-v7',

    maxAge:
      300
  }
)