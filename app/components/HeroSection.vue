<script setup lang="ts">
import { profile } from '~/data/profile'
</script>

<template>
  <section
    id="top"
    class="section hero"
    data-scene="0"
  >
    <div class="hero-copy" data-parallax="0.018">
      <p class="kicker">
        <span class="status-dot" />
        Developer × Marketing Specialist
      </p>

      <h1 class="hero-title">
        <span>I build digital</span>
        <span class="hero-serif">experiences</span>
        <span class="hero-growth">
          and make them <em>grow.</em>
        </span>
      </h1>

      <p class="hero-intro">
        I combine development, product thinking and marketing to build
        digital experiences people can discover, understand and use.
      </p>

      <div class="hero-actions">
        <a
          class="button button-dark"
          href="#developer"
        >
          Explore my work
          <span>↓</span>
        </a>

        <a
          class="button button-quiet"
          href="/resume.pdf"
          download
        >
          Download résumé
          <span>↘</span>
        </a>
      </div>

      <div class="hero-role-line">
        <span>01 / BUILD</span>
        <i />
        <span>02 / GROW</span>
      </div>
    </div>

    <aside
      class="conversation"
      data-parallax="0.035"
      aria-label="Introduction conversation"
    >
      <div class="conversation-top">
        <div>
          <span class="conversation-avatar">
  <img
    src="/images/profile/me-avatar.webp"
    :alt="`${profile.name}, Developer and Marketing Specialist`"
    width="768"
    height="768"
  >
</span>
        </div>

        <div class="conversation-status">
          <span class="online-dot" />
          AVAILABLE
        </div>
      </div>

      <div class="chat-message visitor-chat">
        <span class="chat-author">VISITOR</span>
        <p>
          So what do you
          <strong>actually do?</strong>
        </p>
      </div>

      <div class="chat-connector" aria-hidden="true">
        <span />
      </div>

      <div class="chat-message my-chat">
        <span class="chat-author">ME</span>

        <p>
          Two things.
        </p>

        <p>
          I <strong>build digital products</strong>,
          then help the right people
          <strong>discover and choose them.</strong>
        </p>
      </div>

      <div class="conversation-options">
        <a href="#developer">
          <span>01</span>
          Development
          <b>↗</b>
        </a>

        <a href="#marketing">
          <span>02</span>
          Marketing
          <b>↗</b>
        </a>

        <a href="#about">
          <span>03</span>
          About me
          <b>↗</b>
        </a>
      </div>
    </aside>

    <a class="hero-scroll" href="#developer">
      <span class="scroll-wheel">
        <i />
      </span>

      Scroll to explore
    </a>
  </section>
</template>