import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http; // Importation du package http pour effectuer des requêtes HTTP


// Fonction pour supprimer un marque-page
Future<void> deleteBookmark(String token, int bookmarkId) async {
  final url = Uri.parse('http://10.0.2.2:8084/bookmarks/$bookmarkId'); // URL de l'API pour supprimer un marque-page

  try {
    final response = await http.delete( // Envoie une requête DELETE à l'URL spécifiée
      url,
      headers: <String, String>{
        'Authorization': 'Bearer $token', // Ajoute le token d'authentification dans les en-têtes de la requête
        'Content-Type': 'application/json', // Définit le type de contenu de la requête comme JSON
      },
    );

    if (response.statusCode == 200) {
      print('Bookmark deleted successfully');
    } else if (response.statusCode == 404) {
      print('Bookmark not found or was not created by the current user');
    } else {
      print('Failed to delete bookmark: ${response.statusCode}');
    }
  } catch (e) {
    print('Error deleting bookmark: $e');
  }
}


class Bookmark {
  final int id;
  final int userId;
  final String title;
  final String description;

  Bookmark({required this.id, required this.userId, required this.title, required this.description});

  factory Bookmark.fromJson(Map<String, dynamic> json) {
    return Bookmark(
      id: json['id'],
      userId: json['userId'],
      title: json['title'],
      description: json['description'],
    );
  }
}

Future<List<Bookmark>> getAllBookmarks() async {
  final response = await http.get(Uri.parse('http:/10.0.2.2:8084/bookmarks'));
  if (response.statusCode == 200) {
    List<dynamic> jsonResponse = json.decode(response.body);
    return jsonResponse.map((data) => Bookmark.fromJson(data)).toList();
  } else {
    throw Exception('Failed to load bookmarks');
  }
}