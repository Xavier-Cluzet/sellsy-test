<script setup lang="ts">
  import {ref, computed} from "vue";
  import {GetBaskets} from "../api/basket";
  import type {Baskets, Basket} from "../model/basket";
  import ProductCard from "../components/Product/Card.vue";

  const baskets = ref<Baskets>(await GetBaskets());
  const basketsList = ref<Basket[]>(baskets.value.List);
  const displayedFilters = ref<string[]>(["gender", "color", "price", "sport"]);
  const selectedFilters = {
    genders: ref<string[]>([]),
    colors: ref<string[]>([]),
    price: ref<number[]>([]),
    sports: ref<string[]>([]),
  };
  const filters = computed(() => {
    const genders = ref<string[]>([]);
    const colors = ref<string[]>([]);
    const sports = ref<string[]>([]);
    const price = [
      {
        value: {min: 0, max: 50},
        label: "Moins de 50€",
      },
      {
        value: {min: 50, max: 100},
        label: "50€ - 100€",
      },
      {
        value: {min: 100, max: 150},
        label: "100€ - 150€",
      },
      {
        value: {min: 150, max: Infinity},
        label: "Plus de 150€",
      },
    ];
    baskets.value.List.forEach((basket) => {
      const basketColors = basket.couleur
        .split(", ")
        .map((color) => color.charAt(0).toUpperCase() + color.slice(1).toLowerCase());

      basketColors.forEach((color) => {
        if (!colors.value.includes(color)) {
          colors.value.push(color);
        }
      });

      if (!genders.value.includes(basket.sexe)) {
        genders.value.push(basket.sexe);
      }

      if (!sports.value.includes(basket.sport)) {
        sports.value.push(basket.sport);
      }
    });

    return {
      genders: genders.value,
      colors: colors.value,
      price: price,
      sports: sports.value,
    };
  });

  const onUpdateFilters = () => {
    basketsList.value = baskets.value.List;
    if (0 < selectedFilters.genders.value.length) {
      basketsList.value = basketsList.value.filter((basket) =>
        "Mixte" === basket.sexe ? true : selectedFilters.genders.value.some((gender) => basket.sexe === gender)
      );
    }

    if (0 < selectedFilters.colors.value.length) {
      basketsList.value = basketsList.value.filter((basket) => {
        const colorsAvailable = basket.couleur.split(", ").map((color) => color.toLowerCase());
        return selectedFilters.colors.value.every((color) => colorsAvailable.includes(color.toLowerCase()));
      });
    }

    if (0 < selectedFilters.price.value.length) {
      let minPrice = <number | null>null;
      let maxPrice = <number | null>null;

      selectedFilters.price.value.forEach((selectedFilterPriceKey) => {
        const currentMinPrice = filters.value.price[selectedFilterPriceKey].value.min;
        const currentMaxPrice = filters.value.price[selectedFilterPriceKey].value.max;
        if (null === minPrice) {
          minPrice = currentMinPrice;
        } else if (minPrice > currentMinPrice) {
          minPrice = currentMinPrice;
        }

        if (null === maxPrice) {
          maxPrice = currentMaxPrice;
        } else if (maxPrice < currentMaxPrice) {
          maxPrice = currentMaxPrice;
        }
      });

      basketsList.value = basketsList.value.filter((basket) => {
        const basketPrice = parseFloat(basket.prix.replace("€", "").replace(",", "."));
        return (
          (null !== minPrice ? minPrice <= basketPrice : true) && (null !== maxPrice ? maxPrice >= basketPrice : true)
        );
      });
    }

    if (0 < selectedFilters.sports.value.length) {
      basketsList.value = basketsList.value.filter((basket) =>
        selectedFilters.sports.value.every((sport) => basket.sport === sport)
      );
    }
  };
</script>

<template>
  <a-row :gutter="[15, 15]">
    <a-col :span="24">
      <a-typography-title :level="3">
        {{
          `Nouveautés ${1 === selectedFilters.genders.value.length ? selectedFilters.genders.value[0] : ""} ${
            1 === selectedFilters.colors.value.length ? selectedFilters.colors.value[0] : ""
          } ${1 === selectedFilters.price.value.length ? filters.price[selectedFilters.price.value[0]].label : ""} ${
            1 === selectedFilters.sports.value.length ? selectedFilters.sports.value[0] : ""
          } chaussures (${basketsList.length})`
        }}
      </a-typography-title>
    </a-col>
    <a-col :xs="24" :sm="24" :md="6">
      <a-collapse v-model:activeKey="displayedFilters" expandIconPosition="right" ghost>
        <a-collapse-panel key="gender" :header="`Sexe (${selectedFilters.genders.value.length})`">
          <a-checkbox-group v-model:value="selectedFilters.genders.value" @change="onUpdateFilters">
            <a-row :gutter="[5, 5]">
              <a-col v-for="filter in filters.genders" :span="24">
                <a-checkbox :value="filter">{{ filter }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-collapse-panel>

        <a-divider />

        <a-collapse-panel key="color" :header="`Couleur (${selectedFilters.colors.value.length})`">
          <a-checkbox-group v-model:value="selectedFilters.colors.value" @change="onUpdateFilters">
            <a-row :gutter="[5, 5]">
              <a-col v-for="filter in filters.colors" :xs="24" :sm="8">
                <a-checkbox :value="filter">{{ filter }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-collapse-panel>

        <a-divider />

        <a-collapse-panel key="price" :header="`Rechercher par prix (${selectedFilters.price.value.length})`">
          <a-checkbox-group v-model:value="selectedFilters.price.value" @change="onUpdateFilters">
            <a-row :gutter="[5, 5]">
              <a-col v-for="(filter, key) in filters.price" :span="24">
                <a-checkbox :value="key">{{ filter.label }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-collapse-panel>

        <a-divider />

        <a-collapse-panel key="sport" :header="`Sport (${selectedFilters.sports.value.length})`">
          <a-checkbox-group v-model:value="selectedFilters.sports.value" @change="onUpdateFilters">
            <a-row :gutter="[5, 5]">
              <a-col v-for="filter in filters.sports" :span="24">
                <a-checkbox :value="filter">{{ filter }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-collapse-panel>
      </a-collapse>
    </a-col>

    <a-col :xs="24" :sm="24" :md="18">
      <a-row :gutter="[15, 15]">
        <a-col v-for="basket in basketsList" :xs="24" :sm="12" :md="8" :key="basket.article">
          <ProductCard :basket="basket" />
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
