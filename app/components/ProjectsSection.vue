<script setup lang="ts">
import { profile } from '~/data/profile'

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

type ProjectResponse = {
  username: string

  projects: Project[]

  configured: boolean

  error: string | null
}

const projectTrack =
  ref<HTMLElement | null>(null)

/*
 * Images are optional.
 *
 * If you haven't created one yet, or a
 * file path is wrong, the card gracefully
 * switches to the designed fallback.
 */
const failedImages =
  reactive(
    new Set<number>()
  )

const hasProjectImage = (
  project: Project
) => {
  return Boolean(
    project.image &&
      !failedImages.has(
        project.id
      )
  )
}

const handleImageError = (
  projectId: number
) => {
  failedImages.add(
    projectId
  )
}

/*
 * ---------------------------------------------------------
 * HORIZONTAL NAVIGATION
 * ---------------------------------------------------------
 */

const scrollProjects = (
  direction: -1 | 1
) => {
  const track =
    projectTrack.value

  if (!track) {
    return
  }

  const card =
    track.querySelector<HTMLElement>(
      '.project-card'
    )

  const amount =
    card
      ? card.offsetWidth + 24
      : track.clientWidth *
        0.82

  track.scrollBy({
    left:
      amount *
      direction,

    behavior:
      'smooth'
  })
}

/*
 * ---------------------------------------------------------
 * DATA
 * ---------------------------------------------------------
 */

const {
  data,
  status,
  refresh
} =
  await useFetch<ProjectResponse>(
    '/api/github-projects',
    {
      key:
        'portfolio-github-projects'
    }
  )

const projects =
  computed(
    () =>
      data.value?.projects ??
      []
  )

const projectCount =
  computed(
    () =>
      projects.value.length
  )
</script>

<template>
  <section
    id="work"
    class="section projects-section"
    data-scene="3.4"
    aria-labelledby="projects-heading"
  >
    <!-- ===================================================
         HEADING
         =================================================== -->

    <div class="projects-heading">
      <div>
        <p class="eyebrow">
          Selected work
        </p>

        <h2 id="projects-heading">
          Proof, not promises.
        </h2>
      </div>

      <p class="projects-note">
        Selected projects from my
        development work.
      </p>
    </div>

    <!-- ===================================================
         LOADING
         =================================================== -->

    <div
      v-if="
        status === 'pending'
      "
      class="project-loading"
      aria-live="polite"
    >
      Loading projects…
    </div>

    <!-- ===================================================
         CONFIGURATION ERROR
         =================================================== -->

    <div
      v-else-if="
        !data?.configured
      "
      class="github-empty glass-panel"
    >
      <p class="role-label">
        GitHub connection
      </p>

      <h3>
        GitHub projects are temporarily
        unavailable.
      </h3>

      <p>
        My public work is also available
        directly on GitHub.
      </p>

      <a
        :href="profile.githubUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="button button-dark"
      >
        View my GitHub

        <span>
          ↗
        </span>
      </a>
    </div>

    <!-- ===================================================
         API ERROR / ZERO RESULTS
         =================================================== -->

    <div
      v-else-if="
        data?.error ||
        projectCount === 0
      "
      class="github-empty glass-panel"
    >
      <p class="role-label">
        Selected work
      </p>

      <h3>
        Projects couldn't be loaded
        right now.
      </h3>

      <p>
        {{
          data?.error ||
          'The selected projects are temporarily unavailable.'
        }}
      </p>

      <div class="project-empty-actions">
        <button
          type="button"
          class="button button-dark"
          @click="refresh()"
        >
          Try again
        </button>

        <a
          :href="profile.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="button button-quiet"
        >
          GitHub

          <span>
            ↗
          </span>
        </a>
      </div>
    </div>

    <!-- ===================================================
         PROJECT CAROUSEL
         =================================================== -->

    <div
      v-else
      class="projects-carousel"
    >
      <!-- -----------------------------------------------
           CONTROLS
           ----------------------------------------------- -->

      <div class="projects-carousel-head">
        <div class="projects-progress">
          <span>
            {{
              String(
                projectCount
              ).padStart(
                2,
                '0'
              )
            }}
          </span>

          <i />

          <span>
            selected projects
          </span>
        </div>

        <div
          v-if="
            projectCount > 1
          "
          class="projects-carousel-controls"
        >
          <button
            type="button"
            class="project-nav-button"
            aria-label="Previous project"
            @click="
              scrollProjects(-1)
            "
          >
            ←
          </button>

          <button
            type="button"
            class="project-nav-button"
            aria-label="Next project"
            @click="
              scrollProjects(1)
            "
          >
            →
          </button>
        </div>
      </div>

      <!-- -----------------------------------------------
           HORIZONTAL TRACK
           ----------------------------------------------- -->

      <div
        ref="projectTrack"
        class="project-track"
        aria-label="Selected projects"
      >
        <article
          v-for="
            (
              project,
              index
            ) in projects
          "
          :key="project.id"
          class="project-card"
        >
          <!-- TOP -->

          <div class="project-card-top">
            <span class="project-index">
              {{
                String(
                  index + 1
                ).padStart(
                  2,
                  '0'
                )
              }}
            </span>

            <span
              v-if="
                project.language
              "
              class="project-language"
            >
              {{
                project.language
              }}
            </span>
          </div>

          <!-- ===========================================
               PROJECT VISUAL
               =========================================== -->

          <a
            v-if="
              hasProjectImage(
                project
              )
            "
            :href="
              project.homepage ||
              project.url
            "
            target="_blank"
            rel="noopener noreferrer"
            class="project-card-visual"
            :aria-label="`Open ${project.name}`"
          >
            <img
              :src="
                project.image!
              "
              :alt="`${project.name} project preview`"
              width="1600"
              height="900"
              loading="lazy"
              decoding="async"
              @error="
                handleImageError(
                  project.id
                )
              "
            >

            <span
              class="project-visual-overlay"
            >
              <span>
                View project
              </span>

              <b aria-hidden="true">
                ↗
              </b>
            </span>
          </a>

          <!-- -------------------------------------------
               FALLBACK VISUAL
               ------------------------------------------- -->

          <div
            v-else
            class="
              project-card-visual
              project-card-visual-empty
            "
            aria-hidden="true"
          >
            <span
              class="project-fallback-number"
            >
              {{
                String(
                  index + 1
                ).padStart(
                  2,
                  '0'
                )
              }}
            </span>

            <div
              class="project-fallback-lines"
            >
              <i />
              <i />
              <i />
            </div>
          </div>

          <!-- ===========================================
               BODY
               =========================================== -->

          <div class="project-card-body">
            <h3>
              {{ project.name }}
            </h3>

            <p>
              {{
                project.description ||
                'Selected development project.'
              }}
            </p>

            <div
              v-if="
                project.topics
                  ?.length
              "
              class="tag-row compact"
            >
              <span
                v-for="
                  topic in
                  project.topics.slice(
                    0,
                    4
                  )
                "
                :key="topic"
              >
                {{ topic }}
              </span>
            </div>
          </div>

          <!-- ===========================================
               FOOTER
               =========================================== -->

          <div class="project-card-footer">
            <div class="project-meta">
              <span>
                ★ {{ project.stars }}
              </span>
            </div>

            <div class="project-actions">
              <a
                :href="
                  project.url
                "
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`${project.name} source code on GitHub`"
              >
                Code

                <span>
                  ↗
                </span>
              </a>

              <a
                v-if="
                  project.homepage
                "
                :href="
                  project.homepage
                "
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Open live ${project.name} project`"
              >
                Live

                <span>
                  ↗
                </span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>