<script setup lang="ts">
  import {ref} from "vue";
  import type {Basket} from "../../model/basket";

  const props = defineProps<{
    basket: Basket;
  }>();
  const colorsAvailable = ref<string[]>(props.basket.couleur.split(", "));

  const getImageUrl = (name: string) => {
    return new URL(`../../assets/images/${name.replace(".jpg", ".webp")}`, import.meta.url).href;
  };
</script>

<template>
  <a-card :bordered="false" style="height: 100%">
    <template #cover>
      <div class="product-image-container">
        <img class="product-image" :src="getImageUrl(basket.photo)" :alt="basket.article" />
      </div>
    </template>
    <a-space direction="vertical">
      <a-typography-text strong>
        {{ basket.article }}
      </a-typography-text>
      <a-typography-text type="secondary">
        <span class="gender">
          {{ "Mixte" !== basket.sexe ? `Chaussure pour ${basket.sexe}` : "Chaussure" }}
        </span>
        <br />
        <span class="colors">
          {{ 1 < colorsAvailable.length ? `${colorsAvailable.length} couleurs` : "1 couleur" }}
        </span>
      </a-typography-text>
      <a-typography-text strong>
        {{ basket.prix }}
      </a-typography-text>
    </a-space>
  </a-card>
</template>
