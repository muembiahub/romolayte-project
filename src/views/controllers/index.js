// Import any needed model functions (none are needed for the home page, so this is empty)
const showHomePage = async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
};

// Export any controller functions
export { showHomePage };