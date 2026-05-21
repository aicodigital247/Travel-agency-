/**
 * Grand Voyage Travel - jQuery Enhanced Animation & Interactivity Layer
 */

$(document).ready(function() {
  
  // 1. Scroll Progress Indicator Update
  $(window).on("scroll", function() {
    const scrollTop = $(window).scrollTop();
    const docHeight = $(document).height();
    const winHeight = $(window).height();
    const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
    $(".scroll-progress-bar").css("width", scrollPercent + "%");
    
    // Header Glass Sticky switch
    if (scrollTop > 50) {
      $(".navbar-glass-container").addClass("sticky-scrolled shadowed-header");
    } else {
      $(".navbar-glass-container").removeClass("sticky-scrolled shadowed-header");
    }
  });

  // 2. Animated Stats Counters Loader
  let countersStarted = false;
  function startCounters() {
    $(".stat-counter").each(function() {
      const $this = $(this);
      const targetVal = parseInt($this.attr("data-target"));
      
      $({ countNum: 0 }).animate({ countNum: targetVal }, {
        duration: 2500,
        easing: "swing",
        step: function() {
          $this.text(Math.floor(this.countNum).toLocaleString());
        },
        complete: function() {
          $this.text(targetVal.toLocaleString() + ($this.attr("data-suffix") || ""));
        }
      });
    });
  }

  // Scroll detection specifically for counter activation
  $(window).on("scroll", function() {
    const counterSection = $(".counters-trigger");
    if (counterSection.length && !countersStarted) {
      const oTop = counterSection.offset().top - window.innerHeight;
      if ($(window).scrollTop() > oTop) {
        startCounters();
        countersStarted = true;
      }
    }
  });

  // 3. Travel Destination Category Filter
  $(".filter-btn").on("click", function() {
    const val = $(this).attr("data-filter");
    $(".filter-btn").removeClass("active btn-primary").addClass("btn-outline-secondary");
    $(this).addClass("active btn-primary").removeClass("btn-outline-secondary");

    if (val === "all") {
      $(".filterable-item").fadeOut(300, function() {
        $(".filterable-item").fadeIn(300);
      });
    } else {
      $(".filterable-item").fadeOut(300);
      $(`.filterable-item[data-category="${val}"]`).fadeIn(300);
    }
  });

  // 4. Ajax Flight Finder Simulator Integration
  $("#flight-search-form").on("submit", function(e) {
    e.preventDefault();
    const searchBtn = $(this).find("button[type='submit']");
    const resultsContainer = $("#flight-results-box");
    
    // Animation transitions
    searchBtn.prop("disabled", true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Searching Best Rates...');
    resultsContainer.html(`
      <div class="p-5 text-center">
        <div class="spinner-grow text-primary mb-3" style="width: 3rem; height: 3rem;" role="status"></div>
        <p class="text-muted font-display">Syncing Live Airlines inventory database...</p>
      </div>
    `);

    const flightData = {
      from: $("#flight-from").val(),
      to: $("#flight-to").val(),
      date: $("#flight-date").val(),
      cabinClass: $("#flight-class").val()
    };

    $.ajax({
      url: "/api/flights",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(flightData),
      success: function(response) {
        searchBtn.prop("disabled", false).html('<i class="bi bi-search me-2"></i>Find Perfect Flights');
        
        let outputHtml = `<h4 class="mb-4 display-font">Available Flights (${flightData.from} → ${flightData.to})</h4>`;
        
        response.flights.forEach(f => {
          outputHtml += `
            <div class="glass-card p-4 mb-3 border-start border-4 border-primary">
              <div class="row align-items-center">
                <div class="col-md-3 d-flex align-items-center gap-3">
                  <div class="avatar bg-soft-primary p-2 rounded">
                    <i class="bi bi-airplane-fill text-primary fs-4"></i>
                  </div>
                  <div>
                    <h5 class="mb-0 fs-6">${f.airline}</h5>
                    <small class="text-muted">${f.id}</small>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 class="mb-0 fw-bold">${f.deptime}</h6>
                      <small class="text-muted">${flightData.from}</small>
                    </div>
                    <div class="text-center px-3 position-relative flex-grow-1">
                      <small class="text-muted d-block">${f.duration}</small>
                      <hr class="my-1">
                      <span class="badge bg-light text-dark text-xs">${f.stops}</span>
                    </div>
                    <div>
                      <h6 class="mb-0 fw-bold">${f.arrtime}</h6>
                      <small class="text-muted">${flightData.to}</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-2 text-center text-md-start">
                  <span class="text-muted d-block">Economy Cabin</span>
                  <span class="fs-4 fw-bold text-primary" data-usd-val="${f.price.replace('$','')}">${f.price}</span>
                </div>
                <div class="col-md-3 text-end">
                  <a href="/booking.html?type=flight&id=${f.id}&price=${f.price.replace('$','')}&from=${encodeURIComponent(flightData.from)}&to=${encodeURIComponent(flightData.to)}" class="btn btn-premium-accent w-100">Book Seat Now</a>
                </div>
              </div>
            </div>
          `;
        });
        resultsContainer.hide().html(outputHtml).fadeIn(500);
        window.showToastNotification("Airlines inventory queried successfully!", "success");
      },
      error: function() {
        searchBtn.prop("disabled", false).text("Search Flights");
        window.showToastNotification("Trouble connecting to Airline servers.", "error");
      }
    });
  });

  // 5. Visa Tracking Dashboard Simulator widget
  $("#visa-tracker-form").on("submit", function(e) {
    e.preventDefault();
    const badgeNo = $("#visa-badge-input").val().trim();
    const trackingBox = $("#visa-tracking-results");
    
    if(!badgeNo) {
      window.showToastNotification("Please enter a valid Application Reference ID", "error");
      return;
    }

    trackingBox.html(`
      <div class="d-flex justify-content-center p-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `);

    $.ajax({
      url: `/api/visa-track/${badgeNo}`,
      type: "GET",
      success: function(res) {
        if(res.success) {
          const item = res.data;
          let badgeColor = "status-pending";
          if(item.status === "Approved") badgeColor = "status-approved";
          if(item.status.includes("Rejected")) badgeColor = "status-rejected";

          const resultHtml = `
            <div class="mt-4 p-4 glass-card border-top border-4 border-primary">
              <h5 class="mb-3 display-font d-flex justify-content-between align-items-center">
                <span>Visa Tracking Status File</span>
                <span class="status-indicator ${badgeColor}">${item.status}</span>
              </h5>
              <div class="row g-3 fs-15">
                <div class="col-sm-6">
                  <span class="text-muted d-block text-xs">APPLICANT NAME</span>
                  <strong class="text-uppercase">${item.name}</strong>
                </div>
                <div class="col-sm-6">
                  <span class="text-muted d-block text-xs">MISSION DESTINATION</span>
                  <strong>${item.country}</strong>
                </div>
                <div class="col-sm-6">
                  <span class="text-muted d-block text-xs">VISA CATEGORY</span>
                  <strong>${item.category}</strong>
                </div>
                <div class="col-sm-6">
                  <span class="text-muted d-block text-xs">LAST STATUS UPDATE</span>
                  <strong class="text-warning">${item.updated}</strong>
                </div>
              </div>
              <div class="mt-4">
                <div class="d-flex justify-content-between text-xs mb-1 font-mono">
                  <span>Processing Progress</span>
                  <span>${item.progress}%</span>
                </div>
                <div class="progress" style="height: 10px;">
                  <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: ${item.progress}%"></div>
                </div>
              </div>
            </div>
          `;
          trackingBox.hide().html(resultHtml).slideDown(400);
          window.showToastNotification("Document status retrieved!", "success");
        }
      }
    });
  });

  // 6. Generic Multi-step interactive Booking steps
  let activeStep = 1;
  $(".step-next").on("click", function() {
    const totalSteps = 3;
    if (validateStep(activeStep)) {
      $(`#booking-wizard-step-${activeStep}`).fadeOut(250, function() {
        activeStep++;
        $(`#booking-wizard-step-${activeStep}`).fadeIn(250);
        updateWizardProgress(activeStep, totalSteps);
      });
    }
  });

  $(".step-prev").on("click", function() {
    const totalSteps = 3;
    $(`#booking-wizard-step-${activeStep}`).fadeOut(250, function() {
      activeStep--;
      $(`#booking-wizard-step-${activeStep}`).fadeIn(250);
      updateWizardProgress(activeStep, totalSteps);
    });
  });

  function validateStep(step) {
    if (step === 1) {
      const name = $("#booking-fullname").val();
      const email = $("#booking-email").val();
      if (!name || !email) {
        window.showToastNotification("Fill in your primary contact info details", "error");
        return false;
      }
    }
    return true;
  }

  function updateWizardProgress(curr, max) {
    const percent = ((curr - 1) / (max - 1)) * 100;
    $(".booking-progressbar-fill").css("width", percent + "%");
    
    $(".booking-step-circle").removeClass("active completed");
    for (let i = 1; i <= max; i++) {
      const circle = $(`.booking-step-circle[data-step="${i}"]`);
      if (i < curr) {
        circle.addClass("completed");
      } else if (i === curr) {
        circle.addClass("active");
      }
    }
  }

});
