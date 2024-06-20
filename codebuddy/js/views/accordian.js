document.addEventListener("DOMContentLoaded", function() {
    const accordionBtns = document.querySelectorAll(".accordion_btn"); 
    const contents = document.querySelectorAll(".content");  


        //ACCORDIAN   

        // manter os conteudos fechados quando abro a pag 
        contents.forEach(content => { 
            content.style.display = "none"; 
            content.querySelector(".close_btn").style.display = "none";
        });

        accordionBtns.forEach(btn => {
            btn.addEventListener("click", function() {
                // Fecha todos os conteúdos abertos
                contents.forEach(content => {
                    content.classList.remove("active");
                    content.style.display = "none";
                    content.querySelector(".close_btn").style.display = "none";
                });
        
                // Abre o conteúdo correspondente ao botão clicado 
                const targetId = this.getAttribute('data-target');
                const content = document.getElementById(targetId);
                content.classList.add("active");
                content.style.display = "block";
                content.querySelector(".close_btn").style.display = "block";
            });
        });
        
        const closeBtns = document.querySelectorAll(".close_btn");
        closeBtns.forEach(btn => {
            btn.addEventListener("click", function(e) { 
                e.stopPropagation();
                const content = this.parentElement;
                content.style.display = "none";
                content.classList.remove("active");
                this.style.display = "none";
            });
        });  

        // sub-accordian plano de estudos 
        const studyBtns = document.querySelectorAll(".study_btn"); 
        const studyContainers = document.querySelectorAll(".study_container"); 

        studyContainers.forEach(container => { 
            container.style.display = "none";
        }); 

        studyBtns.forEach(btn => { 
            btn.addEventListener("click", function(){ 
                studyContainers.forEach(container => { 
                    container.classList.remove("active"); 
                    container.style.display = "none"; 
                }); 

                const targetId = this.getAttribute('data-target'); 
                const container = document.getElementById(targetId); 
                container.classList.add("active"); 
                container.style.display = "block";
            })
        })


        const nextBtns = document.querySelectorAll(".btn_next"); 
        nextBtns.forEach(btn => { 
            btn.addEventListener("click", function() { 
                const targetId = this.getAttribute('data-target'); 
                const container = document.getElementById(targetId); 

                studyContainers.forEach(cont => { 
                    cont.classList.remove("active"); 
                    cont.style.display = "none"; 
                }); 

                container.classList.add("active"); 
                container.style.display = "block";
            });
        });
}); 