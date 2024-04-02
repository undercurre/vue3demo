<template>
  <div class="loading_shade">
    <div class="triangle-wrapper">
      <div class="triangle triangle-1">
        <svg class="triangle-svg" viewBox="0 0 140 141">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <polygon
              class="triangle-polygon"
              points="70 6 136 138 4 138"
            ></polygon>
          </g>
        </svg>
      </div>
      <div class="triangle triangle-2">
        <svg class="triangle-svg" viewBox="0 0 140 141">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <polygon
              class="triangle-polygon"
              points="70 6 136 138 4 138"
            ></polygon>
          </g>
        </svg>
      </div>
      <div class="triangle triangle-3">
        <svg class="triangle-svg" viewBox="0 0 140 141">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <polygon
              class="triangle-polygon"
              points="70 6 136 138 4 138"
            ></polygon>
          </g>
        </svg>
      </div>
      <div class="triangle triangle-4">
        <svg class="triangle-svg" viewBox="0 0 140 141">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <polygon
              class="triangle-polygon"
              points="70 6 136 138 4 138"
            ></polygon>
          </g>
        </svg>
      </div>
      <div class="triangle triangle-5">
        <svg class="triangle-svg" viewBox="0 0 140 141">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <polygon
              class="triangle-polygon"
              points="70 6 136 138 4 138"
            ></polygon>
          </g>
        </svg>
      </div>
      <p class="triangle-loading">地图加载中</p>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
.loading_shade {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.8);
}

.triangle {
  animation: grow-and-fade 2000ms linear infinite;
  height: 150px;
  left: 0;
  opacity: 0;
  width: 150px;
  position: absolute;
  top: 0%;
  transform: translatez(0);
  transform-origin: 50% 60%;
  will-change: opacity, transform;
}

.triangle-wrapper {
  height: 150px;
  position: relative;
  width: 150px;
  margin: 0 auto;
  top: 40%;
}
.triangle-loading {
  color: white;
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 300;
  left: 50%;
  letter-spacing: 2px;
  opacity: 0.8;
  position: absolute;
  top: 100%;
  transform: translate3d(-50%, -50%, 0);
}

.triangle-svg {
  margin-top: -20px;
  opacity: 0.5;
  overflow: visible;
}

.triangle-polygon {
  stroke-width: 5px;
}

.triangle-1 {
  animation-delay: 0ms;
}

.triangle-1 .triangle-polygon {
  stroke: hotpink;
}

.triangle-2 {
  animation-delay: 400ms;
}

.triangle-2 .triangle-polygon {
  stroke: aqua;
}

.triangle-3 {
  animation-delay: 800ms;
}

.triangle-3 .triangle-polygon {
  stroke: cornflowerblue;
}

.triangle-4 {
  animation-delay: 1200ms;
}

.triangle-4 .triangle-polygon {
  stroke: yellow;
}

.triangle-5 {
  animation-delay: 1600ms;
}

.triangle-5 .triangle-polygon {
  stroke: white;
}

@keyframes grow-and-fade {
  0% {
    opacity: 0;
    transform: scale(0.1) translatez(0);
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1) translatez(0);
  }
}
@keyframes pulsing-fade {
  0% {
    opacity: 0;
  }

  20% {
    opacity: 0;
  }

  40% {
    opacity: 0.8;
  }

  60% {
    opacity: 0;
  }
}
</style>
