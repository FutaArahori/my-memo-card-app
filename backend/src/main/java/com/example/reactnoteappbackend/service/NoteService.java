package com.example.reactnoteappbackend.service;

import com.example.reactnoteappbackend.entity.Board;
import com.example.reactnoteappbackend.entity.Note;
import com.example.reactnoteappbackend.repository.BoardRepository;
import com.example.reactnoteappbackend.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final BoardRepository boardRepository;
    private final NoteRepository noteRepository;

    @Transactional(readOnly = true)
    public List<Note> getNotesByBoardName(String boardName) {
        Board board = boardRepository.findByName(boardName)
                .orElseGet(() -> {
                    Board newBoard = new Board();
                    newBoard.setName(boardName);
                    return boardRepository.save(newBoard);
                });
        return board.getNotes();
    }

    @Transactional
    public Note createNote(String boardName, Note note) {
        Board board = boardRepository.findByName(boardName)
                .orElseThrow(() -> new RuntimeException("Board not found: " + boardName));
        note.setBoard(board);
        return noteRepository.save(note);
    }

    @Transactional
    public Note updateNote(Long id, Note noteDetails) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found: " + id));

        if (noteDetails.getContent() != null) {
            note.setContent(noteDetails.getContent());
        }
        if (noteDetails.getX() != 0) { // Assuming 0 is not a valid position
            note.setX(noteDetails.getX());
        }
        if (noteDetails.getY() != 0) { // Assuming 0 is not a valid position
            note.setY(noteDetails.getY());
        }
        if (noteDetails.getWidth() != 0) {
            note.setWidth(noteDetails.getWidth());
        }
        if (noteDetails.getHeight() != 0) {
            note.setHeight(noteDetails.getHeight());
        }
        if (noteDetails.getColor() != null) {
            note.setColor(noteDetails.getColor());
        }
        if (noteDetails.getZIndex() != 0) {
            note.setZIndex(noteDetails.getZIndex());
        }
        if (noteDetails.getTags() != null) {
            note.setTags(noteDetails.getTags());
        }
        if (noteDetails.getLastSaved() != null) {
            note.setLastSaved(noteDetails.getLastSaved());
        }

        return noteRepository.save(note);
    }

    @Transactional
    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }
}