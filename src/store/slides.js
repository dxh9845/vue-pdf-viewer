import { readFileToBuffer, SLIDE_LOADED, SLIDE_LOADING, SLIDE_NOT_LOADED } from '../services/pdf.utils';
import { CHANGE_SLIDE, LOAD_PAGE, RESIZE_CONTAINER, RETRIEVE_PAGES, UPLOAD_FILE, ZOOM_PDF, LOAD_PDFJS, RETRIEVE_PAGE_TEXT, UPDATE_CONTEXT } from './actions.type';
import { SET_CONTAINER_SIZE, SET_FILE, SET_FILE_STATUS, SET_PAGE_PROMISES, SET_PDF, SET_RESOLVED_PAGE, SET_SLIDE_NUMBER, SET_PDFJS_LIB, SET_PAGE_WORDLIST } from './mutations.type';
const state = {
    pdfjsLib: null,
    containerHeight: 0,
    containerWidth: 0,
    currentSlideIndex: 0,
    slideStatus: SLIDE_NOT_LOADED,
    file: null,
    pdf: null,
    pdfPages: [],
    pdfPagePromises: [],
    numPages: null,
    pdfPageWords: [],
}

const getters = {
    /**
     * Get whether a current page 
     * @param {Object} state - The current state
     * @returns {Function} - A function that returns a truthiness value whether a slide is the current slide or not.
     */
    isCurrentPage(state) {
        // Based on PDF js index
        return num => (state.currentSlideIndex + 1 == num);
    },
    /**
     * Get a friendly text indication of the loading status
     * @param {Object} state - The state  
     */
    slideStatusText(state) {
        switch (state.slideStatus) {
            case SLIDE_LOADING:
            return "Loading slides...";
            case SLIDE_LOADED:
            return ""
            case SLIDE_NOT_LOADED:
            default:
            return "Upload a slide to get started!";
        }
    },
    /**
    * Filter by pages that have been explicitly loaded 
    * @param {Object} state - The state 
    */
    loadedPages: (state) => {
        return state.pdfPages.filter(page => page._loaded);
    }
}

const actions = {
    async [LOAD_PDFJS]({ commit }, importPromise) {
        const pdfjsLib = await importPromise;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.1.266/lib/pdf.worker.js'
        commit(SET_PDFJS_LIB, pdfjsLib);
    },
    
    /**
    * Upload the file and convert it to a format readable by PDF.js
    * @param {*} param0 
    * @param {*} file 
    */
    async [UPLOAD_FILE]({ state, commit, dispatch }, file) {
        // We've uploaded a file, now we need to process it
        // Set our status to loading and keep a copy of our file
        commit(SET_FILE_STATUS, SLIDE_LOADING);
        commit(SET_FILE, file);
        // Now attempt to convert the file to a format readable by PDF.js
        try {
            // Convert the PDF to an array of type UInt8
            const typedArray = await readFileToBuffer(file);
            const pdf = await state.pdfjsLib.getDocument(typedArray).promise;
            // Set our PDF file
            commit(SET_PDF, pdf);
            // Get the pages of the PDF
            await dispatch(RETRIEVE_PAGES, pdf)
            
            // We've successfully uploaded the file and converted it
            commit(SET_FILE_STATUS, SLIDE_LOADED);
        } catch (error) {
            console.error(error);
        }
    },
    /**
    * Retrieve the pages
    * @param {*} param0 
    * @param {*} pdf - the PDF object we've loaded 
    */
    async [RETRIEVE_PAGES]({ commit, dispatch }, pdf) {
        try {
            // Make an array of promises to resolve as we go through the document
            let pagePromises = Array.from({ length: pdf.numPages }, (_, idx) => pdf.getPage(idx + 1));
            // Set the page promises back to state for future use
            commit(SET_PAGE_PROMISES, pagePromises);
            // Load the first page
            await dispatch(LOAD_PAGE, 0);
        }
        catch (error) {
            console.error(error);
        }
    },
    /**
    * Fetch our page from the page promises, or the cache if already loaded.
    * @param {*} param0 
    * @param {*} pageIndex 
    */
    async [LOAD_PAGE]({ commit, dispatch, state }, pageIndex) {
        // Has this page been loaded already?
        if (!state.pdfPages[pageIndex]._loaded) {
            // Load the PDF (calling pdf.getPage under the hood)
            let resolvedPdf = await state.pdfPagePromises[pageIndex];
            await dispatch(RETRIEVE_PAGE_TEXT, { resolvedPdf, pageIndex });
            commit(SET_RESOLVED_PAGE, { resolvedPdf, pageIndex });
        }
        dispatch(UPDATE_CONTEXT, state.pdfPageWords[pageIndex])
    },
    /**
     * Retrieve text content from PDF page.
     * @param {*} param0 
     * @
     * @param {*} pageIndex 
     */
    async [RETRIEVE_PAGE_TEXT]({ commit }, { resolvedPdf, pageIndex }) {
        let pageText = await resolvedPdf.getTextContent({normalizeWhitespace: true});
        let pageWordSet = new Set();
        for (let item of pageText.items) {
            // Filter out non-word characters
            let words = item.str.match(/([a-z]+[-|'|’][a-z]+)|[a-z]+/ig);
            if (words) {
                words.forEach(word => pageWordSet.add(word));
            }
        }
        commit(SET_PAGE_WORDLIST, { pageWordSet, pageIndex });
    },
    /**
    * Change the slide index, and load if it hasn't been loaded already
    * @param {*} param0 
    * @param {*} changeVal 
    */
    async [CHANGE_SLIDE]({ commit, dispatch, state }, changeVal) {
        let potentialSlideIndex = state.currentSlideIndex + changeVal;
        // Only fire if the slide has been loaded and it's within bounds
        if (state.slideStatus == SLIDE_LOADED && (potentialSlideIndex >= 0 && potentialSlideIndex < state.numPages) ) {
            // Load the PDF page
            await dispatch(LOAD_PAGE, potentialSlideIndex)
            // This is a valid slide index, update the viewing
            commit(SET_SLIDE_NUMBER, potentialSlideIndex)
        }  
    },
    [RESIZE_CONTAINER]({ commit }, { clientHeight, clientWidth }) {
        commit(SET_CONTAINER_SIZE, { clientHeight, clientWidth });
    },
    [ZOOM_PDF]({ dispatch }) {
        
    }
} 

const mutations = {
    [SET_PDFJS_LIB](state, pdfjsLib) {
        state.pdfjsLib = pdfjsLib;
    },
    [SET_FILE_STATUS](state, status) {
        state.slideStatus = status;
    },
    [SET_FILE](state, file) {
        state.file = file;
    },
    [SET_PDF](state, pdf) {
        state.pdf = pdf;
        state.numPages = pdf.numPages;
        // Initialize the array to the PDF size, using an object to denoe page status
        state.pdfPages = Array.from({ length: pdf.numPages }, (x, i) => ({ pageNumber: i, _loaded: false }))
    },
    [SET_PAGE_PROMISES](state, pages) {
        state.pdfPagePromises = pages;
        state.currentSlideIndex = 0;
    },
    [SET_RESOLVED_PAGE](state, { resolvedPdf, pageIndex }) {
        // Set a marker to note this page has been loaded 
        resolvedPdf._loaded = true
        // Set the resolved PDF page back to our pageIndex
        // NOTE: this is a special way of telling vue that an object has been reindexed
        // this._vm.$set(state.pdfPages, pageIndex, resolvedPdf)
        state.pdfPages.splice(pageIndex, 1, resolvedPdf);
        // state.pdfPages[pageIndex] = resolvedPdf;
    },
    [SET_SLIDE_NUMBER](state, slideNum) {
        // Increment or decrement based on change
        state.currentSlideIndex = slideNum;
    },
    [SET_PAGE_WORDLIST](state, { pageWordSet, pageIndex }) {
        state.pdfPageWords[pageIndex] = Array.from(pageWordSet);
    },
    [SET_CONTAINER_SIZE](state, { clientHeight, clientWidth }) {
        state.containerHeight = clientHeight;
        if (clientWidth) {
            state.containerWidth = clientWidth;
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations,
}