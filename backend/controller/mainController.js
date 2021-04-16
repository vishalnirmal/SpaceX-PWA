let home = (req, res)=>{
    res.render("index");
}
let journey = (req, res)=>{
    res.render("journey");
}
let falcon9 = (req, res)=>{
    res.render("falcon-9");
}
let dragon = (req, res)=>{
    res.render("dragon");
}
let falconHeavy = (req, res)=>{
    res.render("falcon-heavy");
}
let startship = (req, res)=>{
    res.render("starship");
}

module.exports = {

    home, 
    falcon9,
    falconHeavy,
    dragon,
    startship,
    journey
};