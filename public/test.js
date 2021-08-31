

// const button = document.querySelector("#button");
var loadImage = document.querySelector('#loading');

document.querySelector('#getads').addEventListener('click',loadads);

let prices = []

function loadads()   // eski versiyon request işlemi
{

    console.log("fonksiyon çalışıyor")

    loadImage.style.display = 'block';

    var url = document.getElementById("product").value; 
        
    var encoded = encodeURIComponent(url);

    console.log(encoded);

    url ='/etsy'+'/'+encoded;
    console.log(url)
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
   
    setTimeout(() => 
    {
        xhr.onload = function()
        {
            loadImage.style.display="none";

            if(this.status === 200)
            {       
                console.log(this.responseText)
                const res = JSON.parse(this.responseText)
                let ads = JSON.parse(res.stdout)
                console.log(ads)

                let html="";
                
                ads.forEach(ad => 
                    {
                        console.log(ad.name);
                        html+= `<tr>
                                    <td id="year">${ad.name}</td>
                                    <td id="km">${ad.image}</td>
                                    <td id="color">${ad.price}</td>
                                </tr>`;
                    });             
                                  
                //document.getElementById('#ads').append(html);
                $('tbody').append(html);
                //document.querySelector('#ads').innerHTML = html;
    
            }
        }
        xhr.send();

    }, 1500);
}
