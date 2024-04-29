function change_p_elements(){
    const elements = document.querySelectorAll('p');
    elements.forEach(p => {
        p.textContent = 'Texto Alterado';
    });
}