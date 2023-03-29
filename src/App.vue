<script setup lang="ts"></script>

<template>
  <a-layout>
    <a-layout-header></a-layout-header>
    <a-layout-content class="main-container">
      <Suspense>
        <RouterView />
      </Suspense>
    </a-layout-content>
  </a-layout>
</template>
