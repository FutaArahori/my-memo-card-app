package com.example.reactnoteappbackend.controller;

import com.example.reactnoteappbackend.entity.Note;
import com.example.reactnoteappbackend.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from React dev server
public class NoteController {

    private final NoteService noteService;

    @GetMapping("/boards/{boardName}/notes")
    public ResponseEntity<List<Note>> getNotesByBoard(@PathVariable String boardName) {
        return ResponseEntity.ok(noteService.getNotesByBoardName(boardName));
    }

    @PostMapping("/boards/{boardName}/notes")
    public ResponseEntity<Note> createNote(@PathVariable String boardName, @RequestBody Note note) {
        return ResponseEntity.ok(noteService.createNote(boardName, note));
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note noteDetails) {
        return ResponseEntity.ok(noteService.updateNote(id, noteDetails));
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }
}