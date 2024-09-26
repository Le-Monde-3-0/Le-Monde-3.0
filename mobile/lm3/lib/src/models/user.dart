import 'dart:ffi';

class UserModel {
  final int id;
  String? token;
  DateTime? createdAt;
  final String email;
  final String username;
  // final List<String> roles;
  final String profilePicCid;
  final String profilePicUrl;

  UserModel({
    this.token,
    required this.id,
    this.createdAt,
    required this.email,
    required this.username,
    // required this.roles,
    required this.profilePicCid,
    required this.profilePicUrl,
  });

  // Factory constructor to create a UserModel from a JSON object
  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as int,
      // token: json['token'] as String?, // Utilisation de String? pour rendre token optionnel
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null, // Vérification et parsing pour createdAt
      email: json['email'] as String,
      username: json['username'] as String,
      // roles: List<String>.from(json['roles']),
      // profilePicCid: json['profilePicCid'] as String,
      // si le profilePicCid est null, on le remplace par une chaine vide
      profilePicCid: json['profilePicCid'] != null ? json['profilePicCid'] as String : '',
      profilePicUrl: json['profilePicUrl'] as String,
    );
  }

  // Factory constructor to create a UserModel from a Map object
  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      id: map['id'] as int,
      // token: map['token'] as String,
      createdAt: DateTime.parse(map['createdAt']),
      email: map['email'] as String,
      username: map['username'] as String,
      // roles: List<String>.from(map['roles']),
      profilePicCid: map['profilePicCid'] as String,
      profilePicUrl: map['profilePicUrl'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'token': token,
      'email': email,
      'username': username,
      // 'roles': roles,
      'profilePicCid': profilePicCid,
      'profilePicUrl': profilePicUrl,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  void updateToken(String newToken) {
    token = newToken;
  }
}