class AuthorModel {
  final int id;
  final DateTime createdAt;
  final String email;
  final String username;
  final List<String> roles;

  AuthorModel({
    required this.id,
    required this.createdAt,
    required this.email,
    required this.username,
    required this.roles,
  });

  factory AuthorModel.fromJson(Map<String, dynamic> json, [bool owner = false]) {
    return AuthorModel(
      id: json['id'] as int,
      createdAt: DateTime.parse(json['createdAt']),
      email: json['email'] as String,
      username: json['username'] as String,
      roles: List<String>.from(json['roles']),
    );
  }

  factory AuthorModel.fromMap(Map<String, dynamic> map, [bool owner = false]) {
    return AuthorModel(
      id: map['id'] as int,
      createdAt: DateTime.parse(map['createdAt']),
      email: map['email'] as String,
      username: map['username'] as String,
      roles: List<String>.from(map['roles']),
    );
  }
}
