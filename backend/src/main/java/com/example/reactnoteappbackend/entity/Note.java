package com.example.reactnoteappbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "notes")
@Data
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String content;

    private int x;
    private int y;
    private int width;
    private int height;
    private String color;

    @Column(name = "z_index")
    private int zIndex;

    @Convert(converter = StringListConverter.class)
    private String[] tags;

    @Column(name = "last_saved")
    private LocalDateTime lastSaved;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    @JsonIgnore
    private Board board;
}