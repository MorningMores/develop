<script setup>
// No special logic required for static homepage sections from the provided design
</script>

<template>
  <div class="home-page">
    <!-- Categories Section -->
    <section class="categories container">
      <h2>Explore Categories</h2>
      <div class="category-list">
        <div class="category-item">
          <img src="/favicon.ico" alt="Category 1" />
          <p>Concerts & Gigs</p>
        </div>
        <div class="category-item">
          <img src="/favicon.ico" alt="Category 2" />
          <p>Festivals & Lifestyle</p>
        </div>
        <div class="category-item">
          <img src="/favicon.ico" alt="Category 3" />
          <p>Sports & Fitness</p>
        </div>
        <div class="category-item">
          <img src="/favicon.ico" alt="Category 4" />
          <p>Education</p>
        </div>
      </div>
    </section>

    <!-- Popular Events Section -->
    <section class="popular-events container">
      <h2>Popular Events</h2>
      <div class="event-filters">
        <button class="filter-btn active">All</button>
        <button class="filter-btn">Today</button>
        <button class="filter-btn">This Week</button>
        <button class="filter-btn">Online</button>
      </div>

      <div class="event-grid">
        <div class="event-card">
          <div class="card-header">
            <span class="tag travel">Travel</span>
            <button class="interest-btn" aria-label="interest"><i class="fa-regular fa-star"></i></button>
          </div>
          <div class="card-content">
            <div class="date">
              <span class="month">OCT</span>
              <span class="day">21</span>
            </div>
            <div class="details">
              <h3>Mountain Hiking Adventure</h3>
              <p>Chiang Mai, Thailand</p>
              <p class="interested"><i class="fa-solid fa-user"></i> 230 interested</p>
            </div>
          </div>
        </div>

        <div class="event-card">
          <div class="card-header">
            <span class="tag cultural">Cultural</span>
            <button class="interest-btn" aria-label="interest"><i class="fa-regular fa-star"></i></button>
          </div>
          <div class="card-content">
            <div class="date">
              <span class="month">NOV</span>
              <span class="day">03</span>
            </div>
            <div class="details">
              <h3>Street Food Festival</h3>
              <p>Bangkok, Thailand</p>
              <p class="interested"><i class="fa-solid fa-user"></i> 1.1k interested</p>
            </div>
          </div>
        </div>

        <div class="event-card">
          <div class="card-header">
            <span class="tag education">Education</span>
            <button class="interest-btn" aria-label="interest"><i class="fa-regular fa-star"></i></button>
          </div>
          <div class="card-content">
            <div class="date">
              <span class="month">NOV</span>
              <span class="day">10</span>
            </div>
            <div class="details">
              <h3>Intro to Web Development</h3>
              <p>Online Workshop</p>
              <p class="interested"><i class="fa-solid fa-user"></i> 540 interested</p>
            </div>
          </div>
        </div>
      </div>

      <div class="see-more">
        <NuxtLink to="/ProductPage" class="btn-secondary">See More</NuxtLink>
      </div>
    </section>

    <!-- Footer Section (page-level) -->
    <footer class="footer">
      <div class="footer-container container">
        <div class="footer-column">
          <h4>Company Info</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Help</h4>
          <ul>
            <li><a href="#">Account Support</a></li>
            <li><a href="#">Listing Events</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Categories</h4>
          <ul>
            <li><a href="#">Concerts & Gigs</a></li>
            <li><a href="#">Festivals & Lifestyle</a></li>
            <li><a href="#">Sports & Fitness</a></li>
            <li><a href="#">Education</a></li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-page {
  --primary-color: #4A90E2;
  --dark-blue: #2C2C3E;
  --text-dark: #333;
  --text-light: #666;
  --border-color: #EAEAEA;
  --bg-light: #F9F9F9;
}

* { box-sizing: border-box; }

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h2 { font-size: 2.5rem; font-weight: 600; text-align: left; margin-bottom: 40px; }

/* Categories */
.categories { padding: 60px 0; }
.category-list { display: flex; justify-content: space-around; gap: 20px; flex-wrap: wrap; }
.category-item { text-align: center; cursor: pointer; }
.category-item img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; transition: transform 0.3s ease; }
.category-item:hover img { transform: scale(1.05); }
.category-item p { font-weight: 500; }

/* Popular Events */
.popular-events { background-color: var(--bg-light); padding: 60px 20px; margin-top: 30px; }
.event-filters { display: flex; justify-content: flex-start; gap: 15px; margin-bottom: 40px; }
.filter-btn { background: none; border: 1px solid var(--border-color); padding: 10px 25px; border-radius: 20px; cursor: pointer; font-size: 1rem; color: var(--text-light); }
.filter-btn.active, .filter-btn:hover { background-color: var(--primary-color); color: #fff; border-color: var(--primary-color); }
.event-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }

.event-card { background-color: #fff; border-radius: 8px; border: 1px solid var(--border-color); box-shadow: 0 4px 12px rgba(0,0,0,0.05); padding: 20px; display: flex; flex-direction: column; gap: 15px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.tag { color: #fff; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; }
.tag.travel { background-color: #007991; }
.tag.cultural { background-color: #7b4397; }
.tag.education { background-color: #d35400; }
.tag.sports { background-color: #27ae60; }
.interest-btn { background: none; border: none; color: var(--text-light); font-size: 1.5rem; cursor: pointer; }
.interest-btn:hover { color: var(--primary-color); }
.card-content { display: flex; gap: 20px; padding-top: 15px; border-top: 1px solid var(--border-color); }
.date { text-align: center; color: var(--primary-color); }
.date .month { font-size: 0.9rem; font-weight: 500; }
.date .day { font-size: 2rem; font-weight: 600; display: block; line-height: 1; }
.details h3 { font-size: 1.2rem; margin-bottom: 5px; }
.details p { font-size: 0.9rem; color: var(--text-light); margin-bottom: 5px; }
.details .interested { color: var(--text-dark); font-weight: 500; }
.details .interested i { color: #f1c40f; }

/* Footer */
.footer { background-color: var(--dark-blue); color: #fff; padding: 60px 0; margin-top: 60px; }
.footer-container { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 30px; }
.footer-column { flex: 1; min-width: 200px; }
.footer-column h4 { font-size: 1.2rem; margin-bottom: 20px; }
.footer-column ul { list-style: none; }
.footer-column ul li { margin-bottom: 10px; }
.footer-column ul a { color: #ccc; text-decoration: none; }
</style>