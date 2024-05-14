import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'user_service.dart';

class Bookmark {
  final int? id;
  final int? userId;
  final String? title;
  final String? description;

  Bookmark({this.id, this.userId, this.title, this.description});

  factory Bookmark.fromJson(Map<String, dynamic> json) {
    return Bookmark(
      id: json['Id'],
      userId: json['UserId'],
      title: json['Title'],
      description: json['Description'],
    );
  }
  Map<String, dynamic> toJson() {
  return {
    'Id': id,
    'UserId': userId,
    'Title': title,
    'Description': description,
  };
}
}


class BookmarkService {
  UserService _userService = UserService();
  static const String _baseUrl = 'http://10.0.2.2:8084';
  final http.Client client;
  final FlutterSecureStorage storage;

  BookmarkService({required this.client, required this.storage});

  Future<List<Bookmark>> getAllBookmarks() async {
    final token = await _userService.getToken();

    final response = await http.get(
      Uri.parse('$_baseUrl/bookmarks'),
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final jsonResponse = json.decode(response.body) as List<dynamic>;
      final bookmarks = jsonResponse.map((data) => Bookmark.fromJson(data)).toList();
      bookmarks.forEach((bookmark) => print(bookmark.toJson()));
      return bookmarks;
    } else {
      throw Exception('Failed to load getbookmarks');
    }
  }

  Future<Bookmark> addBookmark(String title, String description) async {
    final token = await _userService.getToken();

    final response = await http.post(
      Uri.parse('$_baseUrl/bookmarks'),
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(<String, String>{
        'Title': title,
        'Description': description,
      }),
    );

    if (response.statusCode == 201) {
      final jsonResponse = json.decode(response.body);
      return Bookmark.fromJson(jsonResponse);
    } else {
      throw Exception('Failed to create bookmark');
    }
  }

  Future<void> deleteBookmark(int bookmarkId) async {
    final token = await _userService.getToken();

    final response = await http.delete(
      Uri.parse('$_baseUrl/bookmarks/$bookmarkId'),
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to delete bookmark');
    }
  }

  Future<Bookmark> updateBookmark(int bookmarkId, String title, String description) async {
    final token = await _userService.getToken();

    final response = await http.put(
      Uri.parse('$_baseUrl/bookmarks/$bookmarkId'),
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(<String, String>{
        'Title': title,
        'Description': description,
      }),
    );

    if (response.statusCode == 200) {
      final jsonResponse = json.decode(response.body);
      return Bookmark.fromJson(jsonResponse);
    } else {
      throw Exception('Failed to update bookmark');
    }
  }

  Future<void> addArticleToBookmark(int bookmarkId, int articleId) async {
    final token = await _userService.getToken();

    final response = await http.put(
      Uri.parse('$_baseUrl/bookmarks/$bookmarkId/articles/$articleId'),
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to add article to bookmark');
    }
  }

  Future<List<String>> getBookmarkTitles() async {
    List<Bookmark> bookmarks = await getAllBookmarks();
    return bookmarks.map((bookmark) => bookmark.title.toString()).toList();
  }
}
