<template>
  <div class="p-1 rounded-md flex justify-between hover:bg-gray-100">
    <div class="flex gap-4 mx-3">
      <!-- Skeleton for the drag handle -->
      <div class="my-2 py-1 rounded-md animate-pulse">
        <div class="bg-gray-300 h-6 w-6 rounded"></div>
      </div>
      <!-- Skeleton for the channel type icon -->
      <div class="flex justify-center items-center my-2 px-3 rounded-lg animate-pulse">
        <div class="bg-gray-300 h-6 w-6 rounded-full"></div>
      </div>
      <!-- Skeleton for the channel name -->
      <div class="flex items-center truncate overflow-hidden animate-pulse">
        <div class="bg-gray-300 h-6 w-80 rounded"></div>
      </div>
    </div>

    <div class="flex items-center justify-center text-center ml-2">
      <!-- Skeleton for the remove button -->
      <div class="animate-pulse">
        <div class="bg-gray-300 h-6 w-16 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
