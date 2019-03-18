import { UPLOAD_FILE, CHANGE_SLIDE, RETRIEVE_PAGES } from './actions.type';
import { SET_FILE_STATUS, SET_FILE, SET_PDF, SET_PDF_PAGES, SET_SLIDE_NUMBER } from './mutations.type';
import { SLIDE_NOT_LOADED, SLIDE_LOADING, SLIDE_LOADED, readFileToBuffer } from '@/services/pdf.utils';

const state = {
    currentSlideIndex: 0,
    slideStatus: SLIDE_NOT_LOADED,
    file: null,
    pdf: null,
    pdfPages: [],
    numPages: null,
}

const getters = {
    isCurrentPage(state) {
        // Based on PDF js index
        return num => (state.currentSlideIndex + 1 == num);
    },
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
    }
}

const actions = {
    async [UPLOAD_FILE]({ commit, dispatch }, file) {
        // We've uploaded a file, now we need to process it
        // Set our status to loading and keep a copy of our file
        commit(SET_FILE_STATUS, SLIDE_LOADING);
        commit(SET_FILE, file);
        // Now attempt to convert the file to a format readable by PDF.js
        try {
            // Convert the PDF to an array of type UInt8
            const typedArray = await readFileToBuffer(file);
            const pdf = await this.$pdfjsLib.getDocument(typedArray);
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
    async [RETRIEVE_PAGES]({ commit }, pdf) {
        try {
            let pagePromises = Array.from({ length: pdf.numPages }, (_, idx) => pdf.getPage(idx + 1));
            let pages = await Promise.all(pagePromises);
            // Set the pages back to state
            commit(SET_PDF_PAGES, pages);
        }
        catch (error) {
            console.error(error);
        }
    },
    [CHANGE_SLIDE]({ state, commit }, changeVal) {
        let potentialSlideIndex = state.currentSlideIndex + changeVal;
        // Only fire if the slide has been loaded and it's within bounds
        if (state.slideStatus == SLIDE_LOADED && (potentialSlideIndex >= 0 && potentialSlideIndex < state.numPages) ) {
            commit(SET_SLIDE_NUMBER, potentialSlideIndex)
        }
        
    }
} 

const mutations = {
    [SET_FILE_STATUS](state, status) {
        state.slideStatus = status;
    },
    [SET_FILE](state, file) {
        state.file = file;
    },
    [SET_PDF](state, pdf) {
        state.pdf = pdf;
        state.numPages = pdf.numPages;
    },
    [SET_PDF_PAGES](state, pages) {
        state.pdfPages = pages;
        state.currentSlideIndex = 0;
    },
    [SET_SLIDE_NUMBER](state, slideNum) {
        // Increment or decrement based on change
        state.currentSlideIndex = slideNum;
    }
}

export default {
    state,
    getters,
    actions,
    mutations,
}