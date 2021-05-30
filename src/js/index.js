
const tablinks = document.querySelectorAll('.tablinks');
const tabcontent = document.querySelectorAll('.tabcontent');
const defaultOpen = document.getElementById("defaultOpen")

 openCity = (event, cityName) =>{
  tabcontent.forEach(tabcontentLoop =>{
  tabcontentLoop.style.display = 'none'
  })
  const Tabs = document.getElementById(cityName)
  Tabs.style.display = "block";

  tablinks.forEach(tablinksLoop => {
  tablinksLoop.className = tablinksLoop.className.replace('active', "")
  })
  
  event.currentTarget.className += " active";
}
defaultOpen.click();

const barIcon = document.querySelector('#bars');
const mobileDropdown = document.querySelector(".mobile-dropdown")

barIcon.addEventListener('click', ()=>{
mobileDropdown.classList.toggle("toggle-bar")
})


const body = {
  "query" : `
  query { 
    user(login: "Te-Stack"){
      avatarUrl,
      name
      login
      bio
    status{
      emoji
      emojiHTML
    }
      followers{
        totalCount
      }
      following{
        totalCount
     }
     starredRepositories{
      totalCount
    }
      location
      email
      websiteUrl
      twitterUsername
      repositories(first:20, orderBy:{field: UPDATED_AT, direction: DESC}){
       totalCount
        edges{
          node{
            id
            name
            url
            primaryLanguage{
              name
              color
            }
            stargazerCount
            updatedAt
            description
            isFork
            isPrivate
            isArchived
            viewerHasStarred
            forkCount
            licenseInfo{
              name
            }
            parent{
              nameWithOwner
              url
              forkCount
              licenseInfo {
              name
            }
            }
            
          }
        }
  }
    }
    
  }`
}


const token = process.env.API_URL
const baseUrl = "https://api.github.com/graphql";

const headers = {
  "Content-Type": "application/json",
  "Authorization": `bearer ${token}`
}

fetch (baseUrl, {
  method:"POST",
  headers : headers,
  body: JSON.stringify(body)
})

.then(response => response.json())
.then(response => {
  const data = response.data.user
  console.log(data)

  
  const firstDiv = document.querySelector('.div-1')
  const {name,avatarUrl,status,login,bio,location,twitterUsername,websiteUrl,followers,following, starredRepositories, repositories,} = data;

  const navAvatar =  document.querySelectorAll('.nav-image');
  navAvatar.forEach(navAvatar => {
    navAvatar.src = avatarUrl
  })


  const profile = `
    <div class="bio-flex">
      <div>
        <img src =${avatarUrl} alt="profile-pic" ></img><br>
      </div>
      <div class="bio-name">
        <div class="status-emoji">
        ${status.emojiHTML}
        </div>
        <span class="name">${name}</span><br>
        <span class="nick">${login}</span>
      </div>
    </div>
    <p class="about me">${bio}</p>
    <div class="mobile-location">
      <span class="email"><i class="fas fa-map-marker-alt"></i>${location}</span><br>
      <span class="website"><i class="fas fa-link"></i><a href = ${websiteUrl}>${websiteUrl}</a></span><br>
    </div>
    <p class="friends">
      <span class="followers"><a href="#"><i class="fas fa-user-friends"></i><strong> ${followers.totalCount}</strong> followers.</span></a>
      <span class="following"><a href="#"><strong> ${following.totalCount}</strong> following.</span></a>
      <span class = "stars"><a href="#"><i class="far fa-star"></i><strong>${starredRepositories.totalCount}</strong></span></a>
    </p>
    <p class="location">
      <span class="city"><i class="fas fa-map-marker-alt"></i>${location}</span><br>
      <span class="website"><i class="fas fa-link"></i><a href = "#">${websiteUrl}</a></span><br>
      <span class="twitter"><i class="fab fa-twitter"></i><a href = https://www.twitter.com/${twitterUsername}>${twitterUsername}</a></span>
    </p>
    <hr>
  `
  firstDiv.innerHTML = profile

  const repoCount = document.querySelector('.repo-count');
  repoCount.innerHTML = data.repositories.totalCount


  repositories.edges.map((repo, i) => {
  const {name,parent, url,viewerHasStarred, description, stargazerCount, primaryLanguage, licenseInfo,updatedAt,forkCount} = repo.node;
  const contentDiv = document.querySelector(".content-div")
  const repository = () =>{
  contentDiv.innerHTML = '';
   const result = `
    <div class="repository-content">
      <div class="left">
        <p class="repo-name"><a href=${url}>${name}</a><br>
        ${parent? `<span class="forked-source">Forked from <a href = ${parent.url}>${parent.nameWithOwner}</a></span>` : ''}
        ${description ? `<br><span class="repo-description">${description}</span>`: ''
        }  
        </p>
        <div class="repo-extradetails">
        <span class="repo-stack"><i class ="fas fa-circle" style="color: ${primaryLanguage.color};" ></i>${primaryLanguage.name}</span>
        ${stargazerCount? `<span class="repo-star"><i class="far fa-star"></i>${stargazerCount}</span>`: ""}
         ${parent? `<span class="fork-count">${parent.forkCount}</span>`: ""}
          ${licenseInfo? `<span class="license"><i class="far fa-star"></i>${licenseInfo.name}</span>`: ""}

          <span class="repo-update">Updated<span>${formatTimeUpdated(updatedAt)}</span></span>
        </div>
      </div>
      <div class="right">
        <p>
         ${ viewerHasStarred? `<button><i class="fas fa-star" id ="unstar"></i>Unstar</button>`: 
          `<button><i class="far fa-star"></i>Star</button>`}
        </p>
        
      </div>
    </div>
   `
   return result 
  }


  contentDiv.innerHTML += repository()

  })

})
.catch(error=> console.log(error))



const getInterval = (updatedTimeStamp, format) => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const timeParam = { second, minute, hour, day };
  return Math.floor(updatedTimeStamp / timeParam[format]);
}

const formatTimeUpdated = (date) => {
  const updatedDate = Date.parse(date);
  const modifiedUpdate = (new Date(updatedDate)).toDateString()
  const daysInterval = getInterval(Date.now() - updatedDate, "day");
  if (daysInterval >= 30) {
    const [_, month, day, year] = /\s(\w{3})\s(\d{2})\s(\w{4})/.exec(modifiedUpdate);
    return `on ${parseInt(day)} ${month} ${(new Date()).getFullYear() === +year ? "" : year}`
  }
  else {
    let formats = ["day", "hour", "minute", "second"];
    const lastUpdated = formats.map(format => {
      const when = getInterval(Date.now() - updatedDate, format)
      return `${when} ${when > 1 ? `${format}s` : format} ago`;
    })
      .filter(value => parseInt(value) !== 0)
    return lastUpdated[0];
  }
}




