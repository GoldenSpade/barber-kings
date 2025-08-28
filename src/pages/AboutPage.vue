<template>
  <div class="about-page">
    <Navigation />

    <!-- About Hero Section -->
    <div class="about-hero bg-light py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <h1 class="display-4 fw-bold text-dark mb-4">{{ $t('about.title') }}</h1>
            <p class="lead text-muted mb-0">
              {{ $t('about.subtitle') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- About Content Section -->
    <div class="about-content">
      <div class="container h-100 d-flex flex-column justify-content-between">
        <div class="row flex-grow-1 align-items-center">
          <div class="col-12">
            <div class="bg-white p-3 p-md-5 rounded shadow">
              <p class="lead text-dark mb-5">
                {{ $t('about.intro') }}
              </p>

              <h2 class="h3 mb-4 text-dark fw-bold">{{ $t('about.ourStory') }}</h2>
              <p class="text-muted mb-5" style="line-height: 1.8">
                {{ $t('about.ourStoryText') }}
              </p>

              <h2 class="h3 mb-4 text-dark fw-bold">{{ $t('about.whatWeDo') }}</h2>
              <ul class="list-unstyled text-muted mb-5" style="line-height: 2">
                <li>• {{ $t('about.services.cuts') }}</li>
                <li>• {{ $t('about.services.fades') }}</li>
                <li>• {{ $t('about.services.beards') }}</li>
                <li>• {{ $t('about.services.shaves') }}</li>
                <li>• {{ $t('about.services.kids') }}</li>
              </ul>
              <p class="text-muted mb-5" style="line-height: 1.8">
                {{ $t('about.whatWeDoText') }}
              </p>

              <h2 class="h3 mb-4 text-dark fw-bold">{{ $t('about.whyChooseUs') }}</h2>
              <div class="row mb-5">
                <div class="col-md-6 mb-3">
                  <h5 class="fw-bold text-dark">{{ $t('about.features.craft.title') }}</h5>
                  <p class="text-muted">
                    {{ $t('about.features.craft.description') }}
                  </p>
                </div>
                <div class="col-md-6 mb-3">
                  <h5 class="fw-bold text-dark">{{ $t('about.features.clean.title') }}</h5>
                  <p class="text-muted">
                    {{ $t('about.features.clean.description') }}
                  </p>
                </div>
                <div class="col-md-6 mb-3">
                  <h5 class="fw-bold text-dark">{{ $t('about.features.onTime.title') }}</h5>
                  <p class="text-muted">
                    {{ $t('about.features.onTime.description') }}
                  </p>
                </div>
                <div class="col-md-6 mb-3">
                  <h5 class="fw-bold text-dark">{{ $t('about.features.straightTalk.title') }}</h5>
                  <p class="text-muted">
                    {{ $t('about.features.straightTalk.description') }}
                  </p>
                </div>
              </div>

              <h2 class="h3 mb-4 text-dark fw-bold">{{ $t('about.ourPromise') }}</h2>
              <p class="text-muted mb-5" style="line-height: 1.8">
                {{ $t('about.ourPromiseText') }}
              </p>

              <h2 class="h3 mb-4 text-dark fw-bold">{{ $t('about.visitUs') }}</h2>
              <p class="text-muted mb-4" style="line-height: 1.8">
                {{ $t('about.visitUsText') }}
              </p>

              <div class="text-center">
                <router-link :to="{ name: 'booking' }">
                  <button
                    class="btn btn-dark btn-lg px-5 py-3 fw-bold"
                    style="
                      letter-spacing: 2px;
                      background-color: #2c3e33 !important;
                      border-color: #2c3e33 !important;
                    "
                  >
                    {{ $t('home.bookNow') }}
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
.about-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.about-hero {
  background-color: #f8f9fa !important;
}

.about-content {
  padding: 3rem 0;
}

@media (max-width: 768px) {
  .display-4 {
    font-size: 2.5rem !important;
  }

  .about-content {
    padding-top: 0;
    margin-top: 0;
  }
}
</style>
